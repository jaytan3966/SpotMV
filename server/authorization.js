const express = require('express')
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());


const querystring = require('querystring');
const request = require('request');

//using crypto to generate random string
const crypto = require('crypto');

const client_id = "b59b5bedc995467cb3441d3ed84082a0";
const client_secret = "7a24b348d2534bf98e50d5a4a8581aa4";


app.get('/auth', async (req, res) => {
    const state = crypto.randomUUID();
    const scope = 'user-read-private, user-read-email, user-read-currently-playing, user-read-playback-state';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id: client_id,
          scope: scope,
          redirect_uri: "http://localhost:3001/callback",
          state: state
        }));
})
app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    if (state === null){
        res.redirect("http://localhost:3000/home")
    } else {
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
            code: code,
            redirect_uri: "http://localhost:3001/callback",
            grant_type: 'authorization_code'
            },
            headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        request.post(authOptions, function(error, response, body){
            if (!error && response.statusCode === 200){
                const access_token = body.access_token;
                const refresh_token = body.refresh_token;
                res.redirect("http://localhost:3000/home?" + 
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            }
        })
    }
})

app.get('/refresh_token/:refreshToken', function(req, res) {

    const refresh_token = req.params.refreshToken;
    
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const accessToken = body.access_token;
        const refreshToken = body.refresh_token || refresh_token;
        
        res.send({
          'access_token': accessToken,
          'refresh_token': refreshToken
        });
      }
    });
  });

app.listen(3001, () => {
    console.log('Server is running on 3001');
  });