## Inspiration

#### Corporate App
Comapnies have always struggled to get a proper feedback from their clients due to hassle of giving a feedback and replyinhg to a mail. Because of this companies are unable to get a proper assessment of their helpline/Call center services.To overcome this we have come up with a solution using ai and sentiment analysis to get an internal assessment of calls which will serve as feedback of call and help to incentivize the helpline center employees and increase productivity.

#### Chatbot
In today's world, People have overcome from typing to search to using Voice as main component from search. We have used Symbl Realtime Voice API and Google search to retrieve text from voice and get images of response. 

## What it does

Corporate App allows call center employees to login into there account and upload recordings of their calls and get sentiment analysis of call positive,negative or neutral.
He/She can get sentiment analysis of all their previous calls and at the same time get link to audio. Admin can login into Admin Portal and enter employee details to get info of all the calls of that employee. Also he can view details of all the calls uploaded by all the users.

Chatbot uses websockets to connect to symbl ai and get text from audio this text is then searched using google Api and image is displayed to User.Currently we are working on adding more functionalities.

## How we built it
#### Corporate App
1. Employee adds his recordings(wav format only).
2. Video is uploaded in fireBase and downloadable link is Fetched.
3. This link is sent to backend to put Audio on Symbl Audio Async Api and Conversation Id is retrieved.
4. The Audio link, name, and the `conversationId` and `jobId` are saved in a MongoDB databas
5. Using conversation ID , Async API is called and messages are fetched as response. 
6. Messages are then processed to get count of negative , postive and neutral count and get respective percentages. 
7. Theses are stored in Mongodb and response is sent to Frontend and displayed to User.
8. User can also get all details of previous uploaded calls and net Sentiments.
9. Admin can Fetch details of all employess and deatils of there calls.

#### ChatBot
1. User clicks on Mic icon and then a request to setup websocket is sent to symbl API.
2. After sockets are successfully connected user can start speaking.
3. Live transcripts are generated and displayed to user.
4. Once the mic is switched off the query is sent to Google custom search engine and various responses are generated.
5. The app uses one of the response and displays the image of the desired object.


## Technologies Used:
#### Corporate App 
- Symbl Async Audio Api
- React Js
- Node Js
- Express Js
- MongoDB
- Firebase
- HTML
- CSS

#### Chat Bot
- Symbl Live transcript Api
- Node Js
- Express Js
- React Js
- Websocket
- Google Custom Search Api
- HTML
- CSS

## What's next for:
#### Corporate App 
- Adding Multiple uploades for user.
- Allow Admin to generate Beautiful Reports and Graphs from details
- Adding Functionalities for automatic uploades from call.

#### Chat Bot 
- Increase response formats from Chat Bot
- Ablity to save/download responses.
- UI upgradations.

## Live Demo at:
- https://botalysis.netlify.app/  (Frontend Corporate)
- https://botalysischat.netlify.app/  (Frontend Chatbot)
- http://botalysis.herokuapp.com/   (Backend)

## Our Repositories(Currently Private):
- https://github.com/jinik21/botalysisfrontend
- https://github.com/jinik21/Botalysis
- https://github.com/jinik21/Chatbot
