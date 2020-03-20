<?php

namespace App\Http\Controllers;
use GetStream\StreamChat\Client;

use Illuminate\Http\Request;

class ChatMessagesController extends Controller
{
    protected $client;

    public function __construct(){
        $this->client =  new Client(
            getenv("MIX_STREAM_API_KEY"), 
            getenv("MIX_STREAM_API_SECRET"),
        );
    }

    public function generateToken(Request $request){

        try{
            return response()->json([
                'token' => $this->client->createToken($request->name)
            ], 200);
        }catch(\Exception $e){
            return response()->json([
                'errorMessage' => $e->getMessage()
            ],500);
        }
        
    }

    public function getChannel(Request $request){

        try{

            $from = $request->from;
            $to = $request->to;

            
            $from_username = $request->from_username;
            $to_username = $request->to_username;
            
            $channel_name = "livechat-{$from_username}-{$to_username}";
            
            $channel = $this->client->getChannel("messaging", $channel_name);
            // dd( $channel);
            $channel->create($from_username, [$to_username]);

            return response()->json([
                'channel' => $channel_name
            ], 200);

        }catch(\Exception $e){

            return response()->json([
                'errorMessage' => $e->getMessage()
            ],500);

        }

    }
}
