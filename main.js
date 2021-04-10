var roomId;
var players_list;
var statusOfCurrrent;
var p_name;
var letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
var random;
var captcha = '';
var uid = '';
var cards = ['r_0', 'r_1', 'r_1', 'r_2', 'r_2', 'r_3', 'r_3', 'r_4', 'r_4', 'r_5', 'r_5', 'r_6', 'r_6', 'r_7', 'r_7', 'r_8', 'r_8', 'r_9','r_9', 'r_rev', 'r_rev', 'r_skip', 'r_skip', 'r_+2', 'r_+2', 'wild', 'wild', '+4', 'y_0', 'y_1', 'y_1', 'y_2', 'y_2', 'y_3', 'y_3', 'y_4', 'y_4', 'y_5', 'y_5', 'y_6', 'y_6', 'y_7', 'y_7', 'y_8', 'y_8', 'y_9', 'y_9', 'y_rev', 'y_rev', 'y_skip', 'y_skip', 'y_+2', 'y_+2', 'wild', 'wild', '+4', 'b_0', 'b_1', 'b_1', 'b_2', 'b_2', 'b_3', 'b_3', 'b_4', 'b_4', 'b_5', 'b_5', 'b_6', 'b_6', 'b_7', 'b_7', 'b_8', 'b_8', 'b_9', 'b_9', 'b_rev', 'b_rev', 'b_skip', 'b_skip', 'b_+2', 'b_+2', 'wild', 'wild', '+4', 'g_0', 'g_1', 'g_1', 'g_2', 'g_2', 'g_3', 'g_3', 'g_4', 'g_4', 'g_5', 'g_5', 'g_6', 'g_6', 'g_7', 'g_7', 'g_8', 'g_8', 'g_9', 'g_9', 'g_rev', 'g_rev', 'g_skip', 'g_skip', 'g_+2', 'g_+2', 'wild', 'wild', '+4', 'swap_hands']
var firebaseConfig = {
    apiKey: "AIzaSyBKSpaKUoIDipJnLfFL8W9RdGe_1BTWWPA",
    authDomain: "iuno-8d76f.firebaseapp.com",
    databaseURL: "https://iuno-8d76f-default-rtdb.firebaseio.com",
    projectId: "iuno-8d76f",
    storageBucket: "iuno-8d76f.appspot.com",
    messagingSenderId: "352003438084",
    appId: "1:352003438084:web:22a52104e77b4c8a63a751"
};
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var loadFile = function (event) {
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('output');
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
};

window.addEventListener("unload", exit())

function exit() {
    if (uid != '') {
        database.ref('/players/' + uid + '/').update({
            status: 'inactive'
        });
    }
}

function splash() {
    for (i = 0; i < 6; i++) {
        random = Math.floor((Math.random() * 61) + 1);
        captcha += letters.charAt(random)
    }
    document.getElementById('captcha_text').innerHTML = captcha;
    if (localStorage.getItem('name') != null) {
        document.getElementById('name').innerHTML = localStorage.getItem('name');
        document.getElementById('output').src = localStorage.getItem('dp');
    }
}

function login() {
    p_name = document.getElementById('name').value
    if (p_name != '') {
        if (document.getElementById('captcha_entry').value == document.getElementById('captcha_text').innerHTML) {
            if (document.getElementById('save').checked == true) {
                localStorage.setItem('name', document.getElementById('name').value)
                localStorage.setItem('dp', document.getElementById('output').src)
            }
            document.getElementById('login_section').style.display = 'none';
            document.getElementById('game_section').style.display = 'block';
            loadGame();
        } else {
            alert('Invalid captcha!')
        }

    } else {
        alert('Please enter your name!')
    }
}

function loadGame() {
    setTimeout(() => {
        document.getElementById('loader').style.display = "none";
        document.getElementById('cards_section').style.display="block";
        addUser()
        loadOpp()
        addRoom()
    }, 3000);

}

function addUser() {
    uid = Math.round(new Date().getTime() / 1000)
    database.ref('/players/' + uid + '/').set({
        user_name: p_name,
        dp: document.getElementById('output').src,
        status: 'active'
    })
}

function assignCards() {
    //assignCards
    var cards_list = []
    for (let i = 0; i < 7; i++) {
        pred = Math.floor((Math.random() * 61) + 1)
        cards_list.push(cards[pred])
        database.ref('/rooms/' + roomId + '/'+uid+'/').update({
            cards_pics: cards_list
        })
        for (let i = 0; i < cards_list.length; i++) {
            document.getElementById('my_cards_'+i).src = 'images/'+cards_list[i]+'.png';
        }
    }
}

function loadOpp() {
    //loadOpp
    database.ref('/players/').on('value', function (snapshot) {
        players_list = Object.getOwnPropertyNames(snapshot.val())
        for (let i = 0; i < players_list.length; i++) {
            current_player = players_list[i];
            database.ref('/players/' + current_player + '/').on('value', function (snapshot) {
                statusOfCurrrent = snapshot.val();
                if (statusOfCurrrent.name != p_name) {
                    if (statusOfCurrrent.status == 'active') {
                        opp = 'found';
                        addRoom(current_player)
                    }
                }
            })
        }
        if (opp != 'found') {
            alert('Unfortunately, no player is currently active. You may try some time later.')
        }
    });
}

function addRoom() {
    var opp_dp;
    database.ref('/players/' + statusOfCurrrent+'/').on('value', function (snapshot) {
        opp_dp = snapshot.val().dp;
    })
    document.getElementById('opp_name').innerHTML = statusOfCurrrent.name;
    document.getElementById('player_name').innerHTML = p_name;
    document.getElementById('opp_dp').src = opp_dp;
    for (i = 0; i < 20; i++) {
        random = Math.floor((Math.random() * 61) + 1);
        roomId += letters.charAt(random)
    }
    database.ref('/rooms/' + roomId + '/'+uid+'/').set({
        cards_pics: ["cards"],
        last_move:'not played'
    })
    assignCards()
}