import React from "react";
import MicIcon from '@material-ui/icons/Mic';
import CloseIcon from '@material-ui/icons/Close';
class Chat extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: {
        isAudio:false,
      }
    }
  }
  handleAudioOn=async()=>{
    this.setState({ data: { ...this.state.data, isAudio:true } });
    const accessToken= await fetch('http://localhost:3001/symbl-token', {
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
        <div class="chat">
      <div id="sidebar" class="chat__sidebar"></div>
      <div class="chat__main">
        <div id="messages" class="chat__messages"></div>

        <div class="compose">
          <form id="message-form">
            <input
              name="message"
              type="text"
              placeholder="Type your message"
              required
              autocomplete="off"
            />
            <button type="submit">Send</button>
          </form>
          <div>
            {!this.state.data.isAudio?<button onClick={this.handleAudioOn}><MicIcon/></button>:
            <button onClick={this.handleAudioOff}><CloseIcon/></button>}
            
          </div>
        </div>
      </div>
    </div>

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
    </div>
        )}
};

export default Chat;