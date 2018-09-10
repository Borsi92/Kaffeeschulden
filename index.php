<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Kaffeeschulden</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>

    <style>
        #tabelle td{
            text-align:center;
            vertical-align:middle;
        }

        #bohne{
            height: 50px;
            width: 50px;
        }

        .anzeigeText{
            font-size: 22px;
        }

        .btnChange{
            border: none;
            width:70px;
        }

        .btnAdd{
            background-color: #722d10;
            font-weight: bold;
            /*color: #dbdbdb;*/
        }
        button{ /* damit die Button mit img keinen grauen Hintergrund haben, speziell die Bohnen*/
            background-color: #ffffff;
        }

        .custom-margin{
            margin: 1% auto;
        }

        /* für password eingabe */
        #popup {
            width:220px;
            height:100px;
            padding:20px;
            background-color: #6d2e11;
            position:absolute;
            top:30%;
            left:25%;
            color: black;
            font-weight: bold;
            display:none;
        }

        /* CUSTOM NAVBAR*/
        .navbar{
            /*font-size: 1.2em;*/
        }
        .navbar-custom {
            background-color: #6d2e11;
        }
        /* change the brand and text color */
        .navbar-custom .navbar-brand,
        .navbar-custom .navbar-text {
            color: rgba(255,255,255,.8);
        }
        /* change the link color */
        .navbar-custom .navbar-nav .nav-link {
            color: rgba(255,255,255,.5);
        }
        /* change the color of active or hovered links */
        .navbar-custom .nav-item.active .nav-link,
        .navbar-custom .nav-item:hover .nav-link {
            color: #ffffff;
        }
        /* für das Toggler Icon*/
        .navbar-custom .navbar-toggler{
            border-color: rgb(0,0,0);
        }
        .navbar-custom .navbar-toggler .navbar-toggler-icon{
            background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(0,0,0, 0.7)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 8h24M4 16h24M4 24h24'/%3E%3C/svg%3E");
        }

        /* Sticky footer styles-------------------------------------------------- */
        html {
            position: relative;
            min-height: 100%;
        }
        body {
            /* Margin bottom by footer height */
            margin-bottom: 60px;
        }
        .footer {
            position: absolute;
            bottom: 0;
            width: 100%;
            /* Set the fixed height of the footer here */
            height: 60px;
            line-height: 60px; /* Vertically center the text there */
            background-color: #6d2e11;
            color: #ffffff;
            font-size: 1.2em;
        }

        .fa {
            padding: 15px;
            font-size: 20px;
            color: #ffffff;
        }
        .fa:hover {
            color: #d5d5d5;
            text-decoration: none;
        }

        @media (max-width: 600px){
            .mobileSm{
                max-width: 160px;
                max-height: 160px;
            }
        }

    </style>
</head>

<body>

<div class="container_fluid">
    <nav class="navbar navbar-expand-sm navbar-custom">
        <!-- Brand -->
        <a class="navbar-brand" href="index.php"><img src="img/BorsiTec.png"></a>

        <!-- Toggler/collapsibe Button -->
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Links -->
        <div class="collapse navbar-collapse" id="collapsibleNavbar">
            <ul class="navbar-nav">
                <li class="nav-item active">
                    <a class="nav-link" href="index.php">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="game.html">Game</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Tools</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="about.html">About</a>
                </li>
                <!-- Dropdown -->
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown">
                        Huiuiui
                    </a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#">Marius</a>
                        <a class="dropdown-item" href="#">stinkt</a>
                        <a class="dropdown-item" href="#">hart</a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
</div>

<div class="container my-4">
    <h3>Stefan und Marius Kaffeeschulden</h3>
    <div class="table-responsive">
        <table id="tabelle" border="0">
            <tr>
                <th class="anzeigeText">Stefan</th>
                <th class="anzeigeText">Marius</th>
            </tr>
            <tr>
                <td><img class="mobileSm" src="img/stefan.jpg" alt="" height="200" width="200"></td>
                <td><img class="mobileSm" src="img/marius.jpg" alt="" height="200" width="200"></td>
            </tr>
            <tr>
                <td class="anzeigeText"><?php echo file_get_contents("stefan.txt"); ?></td>
                <td class="anzeigeText"><?php echo file_get_contents("marius.txt"); ?></td>
            </tr>
            <tr>
                <td>
                    <button class="btnChange" id = "stefan_plus" src="img/marius.jpg">
                        <img id="bohne" src="img/bohnePlus_t.png">
                    </button>
                    <button class="btnChange" id = "stefan_minus">
                        <img id="bohne" src="img/bohneMinus_t.png">
                    </button>
                </td>
                <td>
                    <button class="btnChange" id = "marius_plus">
                        <img id="bohne" src="img/bohnePlus_t.png">
                    </button>
                    <button class="btnChange" id = "marius_minus">
                        <img id="bohne" src="img/bohneMinus_t.png">
                    </button>
                </td>
            </tr>
            <tr>
                <td><input id="stefanNeu" size="8"></td>
                <td><input id="mariusNeu" size="8"></td>
            </tr>
            <tr>
                <td><button type="button" class="btn btnAdd" id = "stefan_btn">Hinzufügen</button></td>
                <td><button type="button" class="btn btnAdd" id = "marius_btn">Hinzufügen</button></td>
            </tr>
        </table>
    </div>
</div>
<br>
<div class="container">
    <button type="button" class="btn btn-sm btnAdd mb-2" data-toggle="collapse" data-target="#demo">Was ist das hier?</button>
    <div id="demo" class="collapse">
        <p>Dies ist ein kleiner Tool, um Stefan und Marius das Verfolgen der Kaffeeschulden bei dem jeweils anderen zu erleichtern.</p>
        <p>Um einen Kaffee zu den Schulden hinzuzufügen, auf die Bohne mit dem "+" klicken. Um einen Kaffee von den Schulden wegzunehmen auf die Bohne mit dem "-" klicken.</p>
        <p>Um eine variable Anzahl von Kaffees hinzuzufügen, in das Feld die Anzahl eingeben und auf "Hinzufügen klicken.
            Um eine variable Anzahl von den Schulden wegzunehmen, in das Feld die Anzahl mit einem "-" davor eingeben und auf "Hinzufügen" klicken.</p>
    </div>
</div>

<div id="popup">
    <div>Enter Password:</div>
    <input id="pass" type="password" size="8"/>
    <button type="button" class="btn" onclick="done()" style="margin: 0 0 0 10px;">Done</button>
</div>

<footer class="footer">
    <div class="container">
            Connect
            <a href="#" class="fa fa-facebook"></a>
            <a href="#" class="fa fa-twitter"></a>
            <a href="#" class="fa fa-google"></a>
            <a href="https://www.instagram.com/borsi_92" class="fa fa-instagram"></a>
            <a href="https://www.youtube.com/channel/UCPipdRcRtlLy5DLUvTKi1_A" class="fa fa-youtube"></a>
    </div>
</footer>

</body>
</html>

<script>

    var kaffee;
    var person;

    $(".btnChange").click(function () {
        person = this.id.split("_", 1);
        kaffee = this.id.split("_",2)[1];
        if(kaffee == "plus"){
            kaffee = 1;
        }
        else{
            kaffee = -1;
        }
        //alert(person + " " + kaffee);

        showPopup();
    });

    $(".btnAdd").click(function () {
        person = this.id.split("_", 1);
        kaffee = document.getElementById(person + "Neu").value;

        showPopup();
    });

    function writeData(kaffee, person){
        var tabelle = document.getElementById("tabelle");
        // Ajax Befehl
        $.ajax({
            // async: false,
            type: "POST",
            // aufzurufendes PHP-Programm, das die Daten in Datenbank speichern soll
            url: "writeTxt.php",
            // Daten, die an das PHP-Programm übergeben werden sollen
            data: {kaffee: kaffee, file: person + ".txt"},

            success: function(response){
                if(person == "stefan"){
                    tabelle.rows[2].cells[0].innerHTML = response;
                }
                else{
                    tabelle.rows[2].cells[1].innerHTML = response;
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert(errorThrown);
            }
        });
    }

    function showPopup() {
        $("#popup").css("display", "block");

    }
    
    function done() {
        var password = $("#pass").val();

        // Ajax Befehl
        $.ajax({
            // async: false,
            type: "POST",
            // aufzurufendes PHP-Programm, das die Daten in Datenbank speichern soll
            url: "checkPassword.php",
            // Daten, die an das PHP-Programm übergeben werden sollen
            data: {password: password},

            success: function(response){
                if(response == "true"){
                    writeData(kaffee, person);
                    // setze Daten zurück
                    kaffee = "";
                    person = "";
                }
                else{
                    // setze Daten zurück
                    kaffee = "";
                    person = "";
                }
                return response;
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert(errorThrown);
            }
        });
        // setzte Input im input feld zurück
        $("#pass").val("");
        $("#popup").css("display", "none");
    }

</script>