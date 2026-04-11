const CHORDS_API_URL = "https://chords.alday.dev/chords";

const NOTE_MAP = {
    C: "c",
    "C#": "c_sharp",
    Db: "d_flat",
    D: "d",
    "D#": "d_sharp",
    Eb: "e_flat",
    E: "e",
    F: "f",
    "F#": "f_sharp",
    Gb: "g_flat",
    G: "g",
    "G#": "g_sharp",
    Ab: "a_flat",
    A: "a",
    "A#": "a_sharp",
    Bb: "b_flat",
    B: "b",
};

const TYPE_ALIASES = [
    ["maj7", "major_7"],
    ["M7", "major_7"],
    ["maj9", "major_9"],
    ["maj", "major"],
    ["min7", "minor_7"],
    ["m7", "minor_7"],
    ["min9", "minor_9"],
    ["m9", "minor_9"],
    ["min", "minor"],
    ["m", "minor"],
    ["sus2", "sus2"],
    ["sus4", "sus4"],
    ["sus", "sus4"],
    ["add9", "add9"],
    ["dim7", "dim7"],
    ["dim", "dim"],
    ["aug", "aug"],
    ["13", "13"],
    ["11", "11"],
    ["9", "9"],
    ["7", "7"],
    ["6", "6"],
    ["", "major"],
];

const sanitizeChord = (value) =>
    value
        ?.trim()
        .replace(/[()[\]]/g, "")
        .replace(/\s+/g, "")
        .replace(/−/g, "-")
        .replace(/♯/g, "#")
        .replace(/♭/g, "b") || "";

export const normalizeChordLabel = (chord) => sanitizeChord(chord);

export const parseChordParts = (chord) => {
    const normalized = normalizeChordLabel(chord);
    const match = normalized.match(/^([A-G](?:#|b)?)([^/]*)?(?:\/([A-G](?:#|b)?))?$/);

    if (!match) return null;

    const [, root, quality = "", bass] = match;
    return {
        root,
        quality,
        bass: bass || null,
        normalized,
    };
};

const resolveTypeId = (quality) => {
    const cleaned = quality || "";

    for (const [alias, typeId] of TYPE_ALIASES) {
        if (cleaned === alias) {
            return typeId;
        }
    }

    return null;
};

export const parseChordToApiId = (chord) => {
    const parts = parseChordParts(chord);
    if (!parts) return null;

    const noteId = NOTE_MAP[parts.root];
    const typeId = resolveTypeId(parts.quality);

    if (!noteId || !typeId) return null;
    return `${noteId}_${typeId}`;
};

export const getChordReference = async (chord) => {
    const chordId = parseChordToApiId(chord);
    if (!chordId) return null;

    try {
        const response = await fetch(`${CHORDS_API_URL}/${chordId}`);
        if (!response.ok) return null;

        const data = await response.json();
        return {
            id: chordId,
            imageUrl: data?.images?.pos1 || null,
            notes: Array.isArray(data?.notes)
                ? data.notes.map((note) => note?.name?.eng).filter(Boolean)
                : [],
            typeName: data?.type?.name?.eng || null,
        };
    } catch {
        return null;
    }
};
