<?php
/**
 * SKE SMTP MAILER — Pure PHP Gmail SMTP Client
 * No external libraries required. Works on any shared hosting with PHP 7.4+.
 */

class SmtpMailer {

    private $host;
    private $port;
    private $username;
    private $password;
    private $socket;
    private $log = [];

    public function __construct($host, $port, $username, $password) {
        $this->host     = $host;
        $this->port     = $port;
        $this->username = $username;
        $this->password = $password;
    }

    /**
     * Send an HTML email
     */
    public function send(array $to, string $fromEmail, string $fromName, string $subject, string $htmlBody): bool {
        try {
            $this->connect();
            $this->auth();
            $this->sendMail($to, $fromEmail, $fromName, $subject, $htmlBody);
            $this->quit();
            return true;
        } catch (Exception $e) {
            error_log('[SKE Mailer] ' . $e->getMessage());
            return false;
        }
    }

    private function connect(): void {
        $context = stream_context_create([
            'ssl' => [
                'verify_peer'       => true,
                'verify_peer_name'  => true,
                'allow_self_signed' => false,
            ]
        ]);

        $this->socket = stream_socket_client(
            "tcp://{$this->host}:{$this->port}",
            $errno, $errstr, 15,
            STREAM_CLIENT_CONNECT,
            $context
        );

        if (!$this->socket) {
            throw new Exception("Cannot connect to SMTP server: $errstr ($errno)");
        }

        stream_set_timeout($this->socket, 15);
        $this->expect('220');

        $this->cmd("EHLO " . gethostname());
        $this->expect('250');

        // Upgrade to TLS (STARTTLS)
        $this->cmd("STARTTLS");
        $this->expect('220');

        stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);

        $this->cmd("EHLO " . gethostname());
        $this->expect('250');
    }

    private function auth(): void {
        $this->cmd("AUTH LOGIN");
        $this->expect('334');

        $this->cmd(base64_encode($this->username));
        $this->expect('334');

        $this->cmd(base64_encode($this->password));
        $this->expect('235');
    }

    private function sendMail(array $to, string $fromEmail, string $fromName, string $subject, string $htmlBody): void {
        $this->cmd("MAIL FROM:<{$fromEmail}>");
        $this->expect('250');

        foreach ($to as $recipient) {
            $this->cmd("RCPT TO:<{$recipient}>");
            $this->expect('250');
        }

        $this->cmd("DATA");
        $this->expect('354');

        $toHeader   = implode(', ', $to);
        $boundary   = 'SKE_' . md5(uniqid());
        $date       = date('r');
        $msgId      = '<' . time() . '.' . rand(1000, 9999) . '@sreekrishnaenterprizes.com>';
        $fromHeader = "=?UTF-8?B?" . base64_encode($fromName) . "?= <{$fromEmail}>";
        $subjectEnc = "=?UTF-8?B?" . base64_encode($subject) . "?=";

        $headers  = "Date: {$date}\r\n";
        $headers .= "Message-ID: {$msgId}\r\n";
        $headers .= "From: {$fromHeader}\r\n";
        $headers .= "To: {$toHeader}\r\n";
        $headers .= "Subject: {$subjectEnc}\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n";
        $headers .= "X-Mailer: SKE-PHP-Mailer/1.0\r\n";

        $plainText = strip_tags($htmlBody);
        $body  = "--{$boundary}\r\n";
        $body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n{$plainText}\r\n\r\n";
        $body .= "--{$boundary}\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n\r\n{$htmlBody}\r\n\r\n";
        $body .= "--{$boundary}--";

        fwrite($this->socket, $headers . "\r\n" . $body . "\r\n.\r\n");
        $this->expect('250');
    }

    private function quit(): void {
        $this->cmd("QUIT");
        fclose($this->socket);
    }

    private function cmd(string $command): void {
        fwrite($this->socket, $command . "\r\n");
    }

    private function expect(string $code): string {
        $response = '';
        while ($line = fgets($this->socket, 512)) {
            $response .= $line;
            if (substr($line, 3, 1) === ' ') break; // end of multi-line response
        }
        if (substr(trim($response), 0, 3) !== $code) {
            throw new Exception("SMTP expected $code but got: " . trim($response));
        }
        return $response;
    }
}
