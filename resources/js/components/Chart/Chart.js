import React, { useState, useEffect, useRef } from "react";
import { StreamChat } from 'stream-chat';
import './Chart.css';
import axios from 'axios';


const Chart = () => {

    const [client, setClient] = useState(null);
    const clientRef = useRef(null);
    clientRef.current = client;

    const [channel, setChannel] = useState(null);
    const channelRef = useRef(null);
    channelRef.current = channel;

    const [message, setMessage]= useState('');
    const messageRef = useRef('');
    messageRef.current = message;

    const [messageData, setMessageData]= useState([]);
    const messageDataRef = useRef([]);
    messageDataRef.current = messageData;

    useEffect(() => {
        initializeClient();
        createChannel();
    }, []);


    const initializeClient = async () => {
        const {data} = await axios.post("api/generate_token",{name:'client'});
        const client = new StreamChat(process.env.MIX_STREAM_API_KEY, { timeout: 6000 });
        await client.setUser({id: 'client', name: 'Ukeh Hyginus'}, data.token);
        setClient(client);
    }  
    
    const createChannel =  async () => {
        const {data} =  await axios.post('api/get_channel', {
            from_username: "client",
            to_username: "admin",
            from: "client",
            to: "admin",
        })

        if(clientRef.current && data){
            const channel = clientRef.current.channel('messaging', '', {
                name: 'LiveChat channel',
                members: ["client", "admin"]
            });
            
            channel.watch().then(state => {
                channel.on('message.new', event => {
                    const messages = [...messageDataRef.current, event.message];
                    setMessageData(messages);
                });
             })
    
            setChannel(channel);
        }
    }


    const getMessageHandler = (e) => {
        setMessage(e.target.value);
    }


    const sendMessageHandler = async (e) => {
        if(e.charCode === 13){
            if(channelRef.current){
                if(messageRef.current.trim().length > 0){
                    const message = await channelRef.current.sendMessage({
                        text:messageRef.current
                    });
                    setMessage('');
                }
            }
        }
    }

      
    return (
        <div className="row">
            <div className="container">
                <div className="row chat-window col-xs-5 col-md-3 p-0" id="chat_window_1">
                    <div className="col-xs-12 col-md-12 p-0">
                        <div className="panel panel-default">
                            <div className="panel-heading top-bar">
                                <div className="col-md-12 col-xs-12">
                                    <h3 className="panel-title"><span className="glyphicon glyphicon-comment"></span> Client Chat</h3>
                                </div>
                            </div>
                            <div className="panel-body msg_container_base">
                                <br/>
                                {messageData.map((message)=>{
                                    return(
                                        <div key={message.id} className={`row msg_container ${message.user.id == 'client' ? 'base_sent': 'base_receive'}`}>
                                            <div className="col-md-10 col-xs-10">
                                                <div className="messages msg_sent">
                                                    <p>{message.text}</p>
                                                    <time dateTime={message.created_at}>{message.user.name}</time>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="panel-footer">
                                    <div className="input-group">
                                        <input onChange={getMessageHandler.bind(this)} onKeyPress = {sendMessageHandler}  id="btn-input" type="text" className="form-control input-sm chat_input" placeholder="Write your message here..." value={message} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chart;

