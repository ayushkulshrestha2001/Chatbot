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

  handleAudioOn=()=>{
    this.setState({ data: { ...this.state.data, isAudio:true } });
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
        <div id="messages" className="chat__messages"></div>

        <div className="compose">
          <form id="message-form">
            <input
              name="message"
              type="text"
              placeholder="Type your message"
              required
              autoComplete="off"
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