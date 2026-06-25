<?php

namespace App\Policies;

use App\Models\Skill;
use App\Models\User;

class SkillPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Skill $skill): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Skill $skill): bool
    {
        return $user->hasRole('admin');
    }
}
