<?php

namespace App\Policies;

use App\Models\Experience;
use App\Models\User;

class ExperiencePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Experience $experience): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Experience $experience): bool
    {
        return $user->hasRole('admin');
    }
}
