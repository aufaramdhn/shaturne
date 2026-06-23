<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Spatie\Permission\Models\Role;

abstract class TestCase extends BaseTestCase
{
    /**
     * Create an admin user (role assigned under the web guard, matching the
     * dashboard `role:admin` middleware).
     */
    protected function createAdmin(): User
    {
        Role::findOrCreate('admin', 'web');

        return User::factory()->create()->assignRole('admin');
    }
}
