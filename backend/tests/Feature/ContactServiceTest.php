<?php

namespace Tests\Feature;

use App\Mail\ContactAutoReply;
use App\Mail\ContactNotification;
use App\Services\ContactService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactServiceTest extends TestCase
{
    use RefreshDatabase;

    private ContactService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ContactService;
    }

    public function test_store_creates_message_record_in_database(): void
    {
        Mail::fake();

        $message = $this->service->store([
            'name' => 'Andi',
            'email' => 'andi@example.com',
            'message' => 'Ini pesan lengkap dari Andi.',
        ]);

        $this->assertDatabaseHas('messages', [
            'name' => 'Andi',
            'email' => 'andi@example.com',
            'message' => 'Ini pesan lengkap dari Andi.',
            'is_read' => false,
        ]);

        $this->assertNotNull($message->id);
        $this->assertSame('andi@example.com', $message->email);
    }

    public function test_store_queues_both_notification_and_autoreply_mails(): void
    {
        Mail::fake();

        $this->service->store([
            'name' => 'Sari',
            'email' => 'sari@example.com',
            'message' => 'Pesan dari Sari yang cukup panjang.',
        ]);

        Mail::assertQueued(ContactNotification::class, 1);
        Mail::assertQueued(ContactNotification::class, function (ContactNotification $mail) {
            return $mail->envelope()->to[0]->address
                === config('mail.owner_email', 'rathermyself08@gmail.com');
        });

        Mail::assertQueued(ContactAutoReply::class, 1);
        Mail::assertQueued(ContactAutoReply::class, function (ContactAutoReply $mail) {
            return $mail->envelope()->to[0]->address === 'sari@example.com';
        });
    }

    public function test_store_returns_message_even_when_mail_dispatch_throws(): void
    {
        // Simulate the mail driver throwing on queue() — the service must absorb
        // the exception (logged only) and still return the persisted Message.
        Mail::shouldReceive('queue')
            ->andThrow(new \RuntimeException('SMTP unreachable'));

        $message = $this->service->store([
            'name' => 'Dian',
            'email' => 'dian@example.com',
            'message' => 'Pesan dari Dian yang panjangnya cukup.',
        ]);

        // The Message was still created in the DB.
        $this->assertDatabaseHas('messages', ['email' => 'dian@example.com']);

        // The returned value is the Model, not an exception.
        $this->assertSame('dian@example.com', $message->email);
    }
}
