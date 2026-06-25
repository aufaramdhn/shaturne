<?php

namespace App\Mail;

use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Message $contact) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            to: [config('mail.owner_email', 'rathermyself08@gmail.com')],
            subject: "Pesan baru dari {$this->contact->name} | Shaturne",
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.contact-notification');
    }
}
