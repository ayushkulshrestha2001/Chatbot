import React from "react";
import  {ReactMic}  from "react-mic";

class Chat extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          record: false
        }
      }
     
      startRecording = () => {
        this.setState({ record: true });
      }
     
      stopRecording = () => {
        this.setState({ record: false });
      }
     
      onData(recordedBlob) {
        console.log('chunk of real-time data is: ', recordedBlob);
      }
     
      onStop(recordedBlob) {
        console.log('recordedBlob is: ', recordedBlob);
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
        <ReactMic
          record={this.state.record}
          className="sound-wave"
          onStop={this.onStop}
          onData={this.onData}
          strokeColor="#000000"
          backgroundColor="#FF4081" />
        <button onClick={this.startRecording} type="button">Start</button>
        <button onClick={this.stopRecording} type="button">Stop</button>
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