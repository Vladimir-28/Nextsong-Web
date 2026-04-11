import { useEffect, useMemo, useState } from "react";
import {
    getChordReference,
    normalizeChordLabel,
} from "../service/ChordReferenceService";

const SCRIPT_ID = "scales-chords-api-script";
const CHORD_REGEX = /\b([A-G](?:#|b)?(?:maj7|maj9|maj|min7|min9|min|m7|m9|m|dim7|dim|aug|sus2|sus4|sus|add9|6|7|9|11|13)?(?:\/[A-G](?:#|b)?)?)\b/g;

const extractChords = (value) => {
    if (!value) return [];

    const matches = value.match(CHORD_REGEX) || [];
    return [...new Set(matches.map(normalizeChordLabel).filter(Boolean))];
};

export default function ChordDiagrams({ chords }) {
    const chordList = useMemo(() => extractChords(chords), [chords]);
    const [references, setReferences] = useState({});

    useEffect(() => {
        let active = true;

        const loadReferences = async () => {
            if (chordList.length === 0) {
                setReferences({});
                return;
            }

            const entries = await Promise.all(
                chordList.map(async (chord) => [chord, await getChordReference(chord)])
            );

            if (!active) return;

            setReferences(Object.fromEntries(entries));
        };

        loadReferences();

        return () => {
            active = false;
        };
    }, [chordList]);

    useEffect(() => {
        if (chordList.length === 0) return undefined;

        const existing = document.getElementById(SCRIPT_ID);
        if (existing) {
            existing.remove();
        }

        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.async = true;
        script.src = "https://www.scales-chords.com/api/scales-chords-api.js";
        document.body.appendChild(script);

        return () => {
            script.remove();
        };
    }, [chordList]);

    if (chordList.length === 0) {
        return null;
    }

    return (
        <div className="mt-4">
            <h6 className="text-muted fw-semibold mb-3">Diagramas de acordes</h6>
            <div className="d-flex flex-wrap gap-3">
                {chordList.map((chord) => (
                    <div
                        key={chord}
                        className="border rounded-3 p-2 text-center"
                        style={{ backgroundColor: "#fff", minWidth: "110px" }}
                    >
                        <div className="fw-semibold mb-2">{chord}</div>
                        {references[chord]?.imageUrl ? (
                            <>
                                <img
                                    src={references[chord].imageUrl}
                                    alt={`Diagrama de acorde ${chord}`}
                                    style={{ width: "80px", height: "auto" }}
                                />
                                {references[chord].notes?.length > 0 && (
                                    <small className="d-block text-muted mt-2">
                                        Notas: {references[chord].notes.join(" - ")}
                                    </small>
                                )}
                            </>
                        ) : (
                            <ins
                                className="scales_chords_api"
                                chord={chord}
                                instrument="guitar"
                                nolink="true"
                                width="80px"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
