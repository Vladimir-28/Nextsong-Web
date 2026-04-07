package utez.edu.mx.nextsong.services;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendRecoveryCode(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Código de Recuperación - NextSong");
        message.setText("Tu código de recuperación es: " + code + "\n\nEste código expirará en 15 minutos.");
        mailSender.send(message);
    }
}