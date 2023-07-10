<?php
/** @test */
namespace Tests\Unit;
use Tests\TestCase;
use App\Http\Controllers\ChannelController;
use App\Models\Channel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;


class RouteWorkTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test getting channels.
     *
     * @return void
     */
    public function testGetChannels()
    {
        // Utwórz przykładowe dane kanałów
        Channel::factory()->count(5)->create();

        // Utwórz instancję kontrolera
        $controller = new ChannelController();

        // Wykonaj metodę index
        $response = $controller->index();

        // Sprawdź czy odpowiedź ma status 200 (OK)
        $this->assertEquals(200, $response->getStatusCode());

        // Sprawdź czy odpowiedź zawiera oczekiwane dane
        $channels = Channel::all();
        $this->assertEquals($channels->toArray(), json_decode($response->getContent(), true));
    }

    /**
     * Test creating a channel.
     *
     * @return void
     */
    public function testCreateChannel()
    {
        // Dane nowego kanału
        $data = [
            'source' => 'Example Source',
            'customers' => 100,
        ];

        // Utwórz instancję kontrolera
        $controller = new ChannelController();

        // Utwórz żądanie z danymi nowego kanału
        $request = Request::create('/createChannels', 'POST', $data);

        // Wykonaj metodę store
        $response = $controller->store($request);

        // Sprawdź czy odpowiedź ma status 201 (Created)
        $this->assertEquals(201, $response->getStatusCode());

        // Sprawdź czy odpowiedź zawiera oczekiwane dane
        $channel = Channel::find($response->getContent());
        if($channel){
            $this->assertEquals($channel->toArray(), json_decode($response->getContent(), true));
        }
        return $channel;
    }

    /**
     * Test updating a channel.
     *
     * @return void
     */
    public function testUpdateChannel()
    {
        // Utwórz przykładowy kanał
        $channel = Channel::factory()->create();

        // Nowe dane do aktualizacji kanału
        $data = [
            'customers' => 200,
        ];

        // Utwórz instancję kontrolera
        $controller = new ChannelController();

        // Utwórz żądanie z danymi aktualizacji kanału
        $request = Request::create("/updateChannels/{$channel->id}", 'PUT', $data);

        // Wykonaj metodę update
        $response = $controller->update($request, $channel->id);

        // Sprawdź czy odpowiedź ma status 200 (OK)
        $this->assertEquals(200, $response->getStatusCode());

        // Sprawdź czy odpowiedź zawiera oczekiwane dane
        $updatedChannel = Channel::find($channel->id);
        $this->assertEquals($updatedChannel->toArray(), json_decode($response->getContent(), true));
    }

    /**
     * Test deleting a channel.
     *
     * @return void
     */
    public function testDeleteChannel()
    {
        // Utwórz przykładowy kanał
        $channel = Channel::factory()->create();

        // Utwórz instancję kontrolera
        $controller = new ChannelController();

        // Wykonaj metodę destroy
        $response = $controller->destroy($channel->id);

        // Sprawdź czy odpowiedź ma status 204 (No Content)
        $this->assertEquals(204, $response->getStatusCode());

        // Sprawdź czy kanał został usunięty z bazy danych
        $this->assertNull(Channel::find($channel->id));
    }
}
