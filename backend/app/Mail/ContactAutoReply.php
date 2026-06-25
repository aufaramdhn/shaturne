<?php

namespace App\Mail;

use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactAutoReply extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Message $contact) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            to: [$this->contact->email],
            subject: 'Pesanmu sudah diterima | Shaturne',
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.contact-auto-reply');
    }
}
