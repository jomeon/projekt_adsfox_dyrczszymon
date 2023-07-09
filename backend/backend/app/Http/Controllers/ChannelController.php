<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use Illuminate\Http\Request;

class ChannelController extends Controller
{
    public function index()
    {
        $channels = Channel::all();
        return response()->json($channels);
    }

    public function store(Request $request)
    {
        $channel = new Channel();
        $channel->source = $request->input('source');
        $channel->customers = $request->input('customers');
        $channel->save();

        return response()->json($channel, 201);
    }
    public function update(Request $request, $id)
    {

        $channel = Channel::findOrFail($id);
        if($request->input('customers')<0)
        {
            $channel->customers=0;
        }
        else {
            $channel->customers = $request->input('customers');
        }
        $channel->save();

        return response()->json($channel);
    }


    public function destroy($id)
    {
        Channel::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
