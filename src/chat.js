import React from "react";
import MicIcon from '@material-ui/icons/Mic';
import CloseIcon from '@material-ui/icons/Close';
import GoogleImages from "google-images";
class Chat extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: {
        isAudio:false,
        message:"",
        userMessages:[],
        responses:[],
        isclose:false
      },
      client : new GoogleImages('ac478ee049e433320', 'AIzaSyCz8UgubGXywwpD8xyFFkco6aafczNWMNo')
    }
  }

  handleAudioOn=async()=>{
    this.setState({ data: { ...this.state.data, isAudio:true } });
    const accessToken= await fetch('https://botalysis.herokuapp.com/symbl-token', {
        method: 'get',
        headers: { 'Content-type': 'application/json' }
      })
      .then(Response=>Response.json())
      .then(data=>data.accessToken)
 
      const uniqueMeetingId = btoa("user@example.com")
      const symblEndpoint = `wss://api.symbl.ai/v1/realtime/insights/${uniqueMeetingId}?access_token=${accessToken}`;
      
      const ws = new WebSocket(symblEndpoint);
      
      // Fired when a message is received from the WebSocket server
      ws.onmessage = (event) => {
        // You can find the conversationId in event.message.data.conversationId;
        const data = JSON.parse(event.data);
        if (data.type === 'message' && data.message.hasOwnProperty('data')) {
          console.log('conversationId', data.message.data.conversationId);
        }
        if (data.type === 'message_response') {
          for (let message of data.messages) {
            var msg=this.state.data.message+" "+message.payload.content;
            this.setState({ data: { ...this.state.data, message:msg } });
            console.log('Transcript (more accurate): ', message.payload.content);
          }
        }
        if (data.type === 'topic_response') {
          for (let topic of data.topics) {
            console.log('Topic detected: ', topic.phrases)
          }
        }
        if (data.type === 'insight_response') {
          for (let insight of data.insights) {
            console.log('Insight detected: ', insight.payload.content);
          }
        }
        if (data.type === 'message' && data.message.hasOwnProperty('punctuated')) {
          console.log('Live transcript (less accurate): ', data.message.punctuated.transcript)
        }
        console.log(`Response type: ${data.type}. Object: `, data);
      };
      
      // Fired when the WebSocket closes unexpectedly due to an error or lost connetion
      ws.onerror  = (err) => {
        console.error(err);
      };
      
      // Fired when the WebSocket connection has been closed
      ws.onclose = (event) => {
        console.info('Connection to websocket closed');
        this.setState({ data: { ...this.state.data, userMessages:[...this.state.data.userMessages, this.state.data.message] } });
        console.log(this.state.data.userMessages);
        if(this.state.data.message){
          this.state.client.search(this.state.data.message)
    .then(images => {
      if(images.length!=0){
      this.setState({ data: { ...this.state.data, responses:[...this.state.data.responses,images[0].url] } });}
    });
        }
    this.setState({ data: { ...this.state.data, message:"" } });
      };
      
      // Fired when the connection succeeds.
      ws.onopen = (event) => {
        ws.send(JSON.stringify({
          type: 'start_request',
          meetingTitle: 'Websockets How-to', // Conversation name
          insightTypes: ['question', 'action_item'], // Will enable insight generation
          config: {
            confidenceThreshold: 0.5,
            languageCode: 'en-US',
            speechRecognition: {
              encoding: 'LINEAR16',
              sampleRateHertz: 44100,
            }
          },
          speaker: {
            userId: 'example@symbl.ai',
            name: 'Example Sample',
          }
        }));
      };
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      
      /**
       * The callback function which fires after a user gives the browser permission to use
       * the computer's microphone. Starts a recording session which sends the audio stream to
       * the WebSocket endpoint for processing.
       */
      const handleSuccess = (stream) => {
        const AudioContext = window.AudioContext;
        const context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        const processor = context.createScriptProcessor(1024, 1, 1);
        const gainNode = context.createGain();
        source.connect(gainNode);
        gainNode.connect(processor);
        processor.connect(context.destination);
        processor.onaudioprocess = (e) => {
          // convert to 16-bit payload
          const inputData = e.inputBuffer.getChannelData(0) || new Float32Array(this.bufferSize);
          const targetBuffer = new Int16Array(inputData.length);
          for (let index = inputData.length; index > 0; index--) {
              targetBuffer[index] = 32767 * Math.min(1, inputData[index]);
          }
          // Send audio stream to websocket.
          if(this.state.data.isAudio===false && ws.readyState === WebSocket.OPEN)
          {
             ws.send(JSON.stringify({
              "type": "stop_request"
            }));  
          }
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(targetBuffer.buffer);
          }
        };
      };     
      handleSuccess(stream);
      }


  handleAudioOff=()=>{
    this.setState({ data: { ...this.state.data, isAudio:false } });
  }
    render() {
        return(
    <div>
        <div className="chat">
      <div id="sidebar" className="chat__sidebar"></div>
      <div className="chat__main">
        <div id="messages" className="chat__messages">
          {this.state.data.userMessages.map((msg,index)=>(
          <>
            <div class="message message__me">
              {msg}
            </div>
            <div class="message message__res">
              <img style={{height:"150px",width:"100%"}} alt="Image" src={this.state.data.responses[index]}></img>
            </div>
          </>
          ))}
        </div>

        <div className="compose">
          <div>
            {!this.state.data.isAudio?<button onClick={this.handleAudioOn}><MicIcon/></button>:
            <button onClick={this.handleAudioOff}><CloseIcon/></button>}
          </div>
        </div>
      </div>
    </div>

    


    </div>
        )}
};

export default Chat;


{/* <!-- Templates -->
    <script id="message-template" type="text/html">
      <div class="message">
        <p>
          <span class="message__name">{{username}}</span>
          <span class="message__meta">{{createdAt}}</span>
        </p>
        <p>{{message}}</p>
      </div>
    </script>

    <script id="location-url-template" type="text/html">
      <div class="message">
        <p>
          <span class="message__name">{{username}}</span>
          <span class="message__meta">{{createdAt}}</span>
        </p>
        <p>
          <a href="{{url}}" target="_blank">My current location</a>
        </p>
      </div>
    </script>

    <script id="sidebar-template" type="text/html">
      <h2 class="room-title">{{room}}</h2>
      <h3 class="list-title">Users</h3>
      <ul class="users">
        {{#users}}
        <li>{{username}}</li>
        {{/users}}
      </ul>
    </script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/3.0.1/mustache.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qs/6.6.0/qs.min.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script src="/js/chat.js"></script> */}