<?php

namespace Database\Factories;

use App\Models\Channel;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChannelFactory extends Factory
{
    protected $model = Channel::class;

    public function definition()
    {
        return [
            'source' => fake()->name(),
            'customers' => fake()->numberBetween(0, 1000),
        ];
    }
}
