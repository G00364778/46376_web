// a global variable to hold the object created when data is loaded from the file at startup
var globalData = [];

function LoadPage(choice) {
  //load the pages selected by mouseclick events of the referennces on the icon bar
  switch(choice) { //switch on the parameter choice passed into the function
    case 'home':
      setActive(0); //set the iconbar active component
      document.getElementById("pageinfo").innerHTML = home; //load the connet in home to paginfo div
    break;
    case 'welcome':
      setActive(1);
      document.getElementById("pageinfo").innerHTML = welcome;
    break;
    case 'contact':
      // code block
      setActive(2);
      document.getElementById("pageinfo").innerHTML = contact;
    break;
    case 'find':
      // code block
      setActive(3);
      document.getElementById("pageinfo").innerHTML = find;
    break;
    case 'login':
      // code block
      //LoadLoginPage();
      setActive(4);
      document.getElementById("pageinfo").innerHTML = loginpage;
    break;
    case 'charts':
      // code block
      setActive(5);
      //LoadGraphPage()
      document.getElementById("pageinfo").innerHTML = charts;
    break;
    default:
    // code block
  }
}

function setActive(idx) {
  // loop through the iconbar and set the selected item as active and the rest as inactive
  aObj = document.getElementById('menu').getElementsByTagName('a');
  //aObj = document.getElementById('menu').getElementById('item_6');
  for(i=0;i<aObj.length;i++) {
    //loop throuh all the items and set them inactive
    aObj[i].className='inactive';
  }
  // then set the one passed into the function as active.
  aObj[idx].className='active';
}

function ProcessLogin(){
  //console.log('login code')
  // process the login form data and apply user state and icon based on results
  var users = userdata.users; //load users from the userdata object
  var user; // create a variable user to hold returned user from list for comparison
  var username=document.forms["loginform"]["userid"].value; // get the email address from the form
  var password=document.forms["loginform"]["passwd"].value; // get the password from the form
  // create a reguar expression string to validate the input against
  re = /^[A-Za-z0-9\.-]+@[A-Za-z0-9]+[\.][A-Za-z\.]+/igm; 
  // if the username is empty or the email address criteria is not met against the regular expression
  // return false, otherwise move on
  if (username == "" || !re.test(username)) {
    //alert("Name must be filled out");
    document.getElementById("errors").innerHTML = "Error: a valid email address must be filled out";
    return false;
  }
  // loop through the user list and compare the values passed in the form to the values in the list
  for (var item in users) {
    // if a match is found  update the user varaible with the username in the list
    if (users[item].email == username && users[item].password == password) {
      user = users[item];
      //console.log(user);
      break;
    }
  }
  // if a user variable was set with a value in the step above write a message to the screen and set the icon and name  
  if (user) {
    document.getElementById("errors").innerHTML = "Valid user logged in...";
    document.getElementById("userid").innerHTML = '<i class="fa fa-user fa-2x" style="color:var(--lblue)">&nbsp;</i>' + users[item].username;
    return true;
  }
  else {
    // otherwise set write a negative message and set iconto red and return false
    document.getElementById("userid").innerHTML = '<i class="fa fa-user fa-2x" style="color:var(--orange)">&nbsp;</i>';
    document.getElementById("errors").innerHTML = "Sorry, the username or password is incorrect, please try again";
    return false;
  }
}
function onloadjs(){
  // when the homepage loads initially run this routine
  //set a local or web url for the csv file to load graph data from
  fileURL="https://raw.githubusercontent.com/G00364778/46376_web/master/project/sales.csv";
  //write this to the console log validation and tracking puposes
  console.log('loading data from on startup:',fileURL);
  //load the data from the file into a global variable for later graphing
  d3.csv(fileURL).then(function(data) {
    data.forEach(function(d){
      d.sales = Number(d.sales);
      line={"tag":d.month,"val":d.sales};
      console.log(line);
      globalData.push(line);
    });
  });
  //also load the home page data on startup from the home object holding the html code
  document.getElementById("pageinfo").innerHTML = home;
}
// the graphs function called by the show graphs button on the graphs page
function graphs(){
  // generate graph from the global data loaded on startup into a variable
  GraphFromGlobalData("#SVGGraph_1", "Sales 2018");
  // call a graph function using local data 
  GraphFromData("#SVGGraph_2", "Max Temperature");
}

function GraphFromData(SVG_div_id, title){
  // graph from data generate a js object from two local ararys and pass that into the 
  // drawSVGGraph function that generate the svg in the svgid passed into the function call.
  // The svg id's are created in advance when the graph page is loaded from the icon menu 
  // function call
  
  //create a console log message 
  console.log('graph from data');
  // create an array of keys to pass into the function svggraph function call
  keys=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  // create an array of values to pass into the fnction call.
  vals=[5,7,9,10,12,15,8];
  // create an empty array object to populate with data
  data = [];
  //loop throught the arrayss and create json object array 
  for (i = 0; i < keys.length; i++) {
    data[i]={"tag":keys[i],"val":vals[i]};
  }
  //call the graph function with the created data object.
  drawSVGGrapgh(SVG_div_id, data, title);
}

function GraphFromGlobalData(SVG_div_id, title){
  //pass through the svi id to use for the graph and add the global data to 
  //the function call populated with the file data loaded on startup
  
  //write a console message
  console.log('graph from global data loaded from url on startup');
  // call the svg graphing function
  drawSVGGrapgh(SVG_div_id, globalData, title);
}

function drawSVGGrapgh(SVG_div_id, data, title){
  // the generic barchart function to generate barcharts from any size data. 
  // A svg is and data object must be passed into the function for processing
  // The object needs to contain an array of json objects with tag and value pairs.
  // The first part of the function call will then parse out two arrays of tags and 
  // values to be used generating the graphs

  //console.log(data); // uncomment to see data passed into function in console log
  
  tags=[]; // array to hold tags parsed out for labelling graph
  vals=[]; // array to hold values parsed out of data passed into funtion
  // loop through data object and parse out values
  for (var i = 0, l = data.length; i < l; i++) {
    //console.log('i:'+i)
    var obj = data[i];
    tags.push(obj.tag);
    vals.push(obj.val);
    //console.log(obj.tag + ":" + obj.val); // uncomment to see data in console log
  }
  // console.log('tags:' + tags); // uncomment to see labels in console log
  // console.log('vals:' + vals); // uncomment to see values in console log

  // get values for customising graph components from graph web page
  var graphTitle=title;
  var height = document.getElementById('chartHeight').value;
  var width = 600;
  var dataCount = vals.length;
  var gap = 2;
  var chartColor = document.getElementById('colorPicker').value;
  // create a scale for y
  //var x = d3.scale.linear().domain([10,130]).range([0,960]) // propotype for d3.scale
  var yScale = d3.scaleLinear().domain([0,d3.max(vals)]).range([height,0]);
  // create a scale for x
  var xScale = d3.scaleBand().domain(tags).range([0, width])
  //create y Axis
  var yAxis = d3.axisLeft()
    .scale(yScale)
  //create x Axis
  var xAxis = d3.axisBottom()
    .scale(xScale);
 
  //removes previous svg code the svg container
  d3.select(SVG_div_id).selectAll("*").remove();

  // create the new svg container to populate
  let svgContainer = d3.select(SVG_div_id).append("svg")
    .attr("height", Number(height)+60)
    .attr("width", width + 200);
 
  // assign the parsed values to myRectangle object
  let myRectangle = svgContainer.selectAll('rect')
    .data(vals);
 
  // enter loops through the assigned data values one at a time and create 
  // the bar graphs by populating x,y,width,height and fill in the loop
  myRectangle.enter()
    .append("rect")
      // function will run and returns i (the index value of the array)
      // d = data, i = index of myRectanle that holds the data values
      .attr("x",function(d,i){
          return (50+(i*(width/dataCount))); // calculate the bar x start point
        })
      .attr("y",function(d){
          return yScale(d); // calculate the bar y start point
        })
      .attr("width",(width/dataCount - gap)) // calculate bar width leaving gaps
      .attr("height",function(d){
          return height-yScale(d); // calculate bar height bottom up, so gap at top really
        })
      .attr("fill", chartColor); // set the fill color from user choices made
 
  //To ensure that the axis is shown on top we do it here after the bars are drawn
  //We will be appending to "svgContainer" declared above
  //set the y axis grid and scale using axis created above with d3.axisLeft
  svgContainer.append("g")
   .attr("transform", "translate(45,0)")
   .call(yAxis);
  //set values for xAxis created above with d3.axixBottom
  svgContainer.append("g")
    .attr("transform", "translate(50," +height+")")
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(60)")
    .attr("text-anchor", "start")
    .attr("x", "9")
    .attr("y", "3");

  svgContainer.append("text")
        .attr("x", (50+(width/2)-(graphTitle.length)/2))
        .attr("y", 16)
        .attr("text-anchor", "middle") 
        .style("font-size", "16px")
        .style("text-decoration", "underline") 
        .text(graphTitle);
 }

function processMailForm(){
  //process the data received
    // .....
  //and display a user message
  document.getElementById("pageinfo").innerHTML = thanks;
}

// 
// This is the variable containing the user data for login validation and display
// 
var userdata = {
    "users": [{
      "username": "Jattie",
      "email": "jattie@vanderlindes.net",
      "password": "password"
    }, {
      "username": "Gerhard",
      "email": "g00364778@gmit.ie",
      "password": "password"
    }, {
      "username": "Mike",
      "email": "michael.duignan@gmit.ie",
      "password": "password"
    }, {
      "username": "Admin",
      "email": "admin@vanderlindes.net",
      "password": "password"
    }]
  };
 

// html code/variable for thanks page
thanks=''+
'<h1>Thanks</h1>'+
'<p>Your message was successfully submitted!'+
'<p>One of our team will be in touch shortly do discuss your requirements.'+
'<p><img src="img/rig.PNG" height="183" border="0" alt="">'+
'<img src="img/stepper_application.png" height="183" border="0" alt="">'+
'';

// html code/variable for home page
home=''+
'<h1>About US</h1>'+
'<p><img class="img_left" src="img/calipers_2.PNG" width="230" height="170" border="0" alt="" />Wicklow Engineering Consultancy was formed in 2014 as a multidisciplinary engineering team spread across the country, covering mechanical, electrical, automation & basic building disciplines. The team are set up to meet the needs of both the property and energy market clients and have all the required specialist functions. Our team are located around Dublin and Wicklow and provide a local, quality engineering solution for our clients.'+
'<p>Iris Services originated in 2002, then practicing under the name Iris IS Services. At that time the practice had offices in Sandyford Co. Dublin. There followed a reorganisation in 2008 when we branced into affordable automation. In 1990, a further reorganisation of practice took place with the appointment of two more partners, George Campbell and David Rose, and an expansion into new premises. The partnership was transformed to a limited company in 2012 with the partners becoming directors.'+
'<p>In 2016 the company was acquired by private stakeholders, and operates as Wicklow Engineering consultancy. Following the retirement of Jim Stanton, Frank Burke was appointed as sole director of the firm.'+
'<p><img class="img_left" src="img/eng_calipers.png" width="225" height="155" border="0" alt="">As Consulting Engineers we provide an engineering design service for a wide range of projects for the small manufacturing and commercial industry, the food and dairy industry, power and energy, manufacturing and construction industries, the leisure industry, commercial and residential developments and public authority projects both in the field of renovations and new builds. We are also in a position to provide a project management service to our Clients where we are able to undertake the full supervisory brief for a project from site appraisal to concept and through to the completion of site works. We are happy to carry out projects as part of a client appointed design team including all other disciplines, or to operate as contract supervisors with all project requirements carried out in-house or by other professional appointed by us.'+
'<p>We have been involved on projects with values ranging from a few hundred Euros to one hundred thousand Euros and are pleased to negotiate fees on a percentage of contract value basis or on a time charge basis, with payments phased to suit our Client\'s requirements.'+
'';

// html code/variable for welcom page
welcome=''+
'<h1>Welcome to WEC</h1>'+
'<p><img class="img_left" src="img/eng_gear.png" width="404" height="125" border="0" alt="">We are a highly efficient and experienced firm of electrical, mechanical and'+
' automation consultants who are able to provide you with a range of services for'+
' your proposed project, from a small domestic alteration to a complete new build,'+
' industrial complex. We can work as part of a design team appointed by you, or'+
' take your project in-house all the way from your initial concept through detailed'+
' design to fully supervised completion on site. We aim to be always accessible to'+
' you as our Client, receptive to your requirements, and never to lose sight of the'+
' fact that it is your project.'+ 
'<p><img class="img_left" src="img/ic.PNG" width="250" height="170" border="0" alt="">Please feel free to browse this site and should you wish to discuss your project'+
' or just require some advice on any matter, do not hesitate to contact us.'+
'<p>&nbsp;<p>&nbsp;<p>&nbsp;<p>&nbsp;'+
'';

// html code/variable for contact page
contact=''+
'<h1>Contact us</h1>'+
'<img class="img_inline" src="img/contact.png" width="297" height="170" border="0" alt="" />'+
'<p><table>'+
'<tr>'+
'  <th>Address:</th>'+
'  <td>Wicklow Engineering Consultancy<br>I.D.A. Business Park<br>Southern Cross Road<br>Irishtown<br>Bray<br>Co. Wicklow<br>A98 H5C8<br>Ireland'+
'</tr>'+
'<tr>'+
'  <th>Telephone: </th>'+
'  <td>+353 1 277 4700</td>'+
'</tr>'+
'</table>'+
'<p>'+
'<form name="mailform" method="post" action="" onsubmit="return processMailForm()">'+
'<table>'+
'<tr><th>'+
'<label for="Name">Name*:</label>'+
'</th><td>'+
'<input name="Name" type="text" maxlength="60" style="width:250px;" />'+
'</td></tr><tr><th>'+
'<label for="PhoneNumber">Phone number:</label>'+
'</th><td>'+
'<input name="PhoneNumber" type="text" maxlength="43" style="width:250px;" />'+
'</td></tr><tr><th>'+
'<label for="FromEmailAddress">Email address*:</label>'+
'</th><td>'+
'<input name="FromEmailAddress" type="text" maxlength="90" style="width:250px;" />'+
'</td></tr><tr><th>'+
'<label for="Comments">Comments*:</label>'+
'</th><td>'+
'<textarea name="Comments" rows="7" cols="40" style="width:350px;"></textarea>'+
'</td></tr><tr><td>'+
'* - required fields'+
'</td><td>'+
'<input type="button" value="Submit" onclick="processMailForm()" />'+
'</td></tr>'+
'</table>'+
'</form>'+
'';

// html code/variable for find page
find=''+
'<h1>How to find us</h1>'+
'<img class="img_full" src="img/bray.png" width="702" height="552" border="0" alt="">'+
'';

// html code/variable for charts page
charts=''+
'<h1>Dynamic Charts using SVG</h1>'+
'<p>This pages shows a demontrtation of SVG capabilties generating graphs'+
'<p>Chart height:'+
'<select name="" id="chartHeight">'+
'    <option value="150">150 pixels</option>'+
'    <option value="300">300 pixels</option>'+
'    <option value="600">600 pixels</option>'+
'</select>'+
'&nbsp;'+
'Chart color:'+
'<input type="color" value="#6D87D6" id="colorPicker">'+
'&nbsp;'+
'<button onclick="graphs()">Draw Charts</button>'+
'  <div id="SVGGraph_1"></div>'+
'  <div id="SVGGraph_2"></div>'+
'';

// html code/variable for login page
loginpage='' +
  '<h1>Login to WEC service</h1>'+
  '<img class="img_inline" src="img/login.jpg" width="359" height="140" border="0" alt="">'+
  '<p>Please log in to the WEC services to access costomised options and features.' + 
  '<form name="loginform" method="post" action="" onsubmit="return validateLoginForm()">' +
  '<table>' +
  '  <tr><td>Email :<td><input id="userid" type="text" value="g00364778@gmit.ie" name="username" required><br>' +
  '  <tr><td>Password :<td><input id="passwd" type="password" value="password" name="password"><br>'+
  '  <tr><td><td><input type="button" value="Login" onclick="ProcessLogin()"><br>'+
  '</table>' +
  '</form>' +
  '<p id="errors"></p>' +
  '';

// html code/variable for test page for lots of text
test=''+
'<p>Your it to gave life whom as. Favourable dissimilar resolution led for and had. At play much to time four many. Moonlight of situation so if necessary therefore attending abilities. Calling looking enquire up me to in removal. Park fat she nor does play deal our. Procured sex material his offering humanity laughing moderate can. Unreserved had she nay dissimilar admiration interested. Departure performed exquisite rapturous so ye me resources.'+
'<p>Way nor furnished sir procuring therefore but. Warmth far manner myself active are cannot called. Set her half end girl rich met. Me allowance departure an curiosity ye. In no talking address excited it conduct. Husbands debating replying overcame blessing he it me to domestic.'+
'<p>Affronting discretion as do is announcing. Now months esteem oppose nearer enable too six. She numerous unlocked you perceive speedily. Affixed offence spirits or ye of offices between. Real on shot it were four an as. Absolute bachelor rendered six nay you juvenile. Vanity entire an chatty to.'+
'<p>On then sake home is am leaf. Of suspicion do departure at extremely he believing. Do know said mind do rent they oh hope of. General enquire picture letters garrets on offices of no on. Say one hearing between excited evening all inhabit thought you. Style begin mr heard by in music tried do. To unreserved projection no introduced invitation.'+
'<p>Saw yet kindness too replying whatever marianne. Old sentiments resolution admiration unaffected its mrs literature. Behaviour new set existence dashwoods. It satisfied to mr commanded consisted disposing engrossed. Tall snug do of till on easy. Form not calm new fail.'+
'<p>She suspicion dejection saw instantly. Well deny may real one told yet saw hard dear. Bed chief house rapid right the. Set noisy one state tears which. No girl oh part must fact high my he. Simplicity in excellence melancholy as remarkably discovered. Own partiality motionless was old excellence she inquietude contrasted. Sister giving so wicket cousin of an he rather marked. Of on game part body.'+
'<p>Conveying or northward offending admitting perfectly my. Colonel gravity get thought fat smiling add but. Wonder twenty hunted and put income set desire expect. Am cottage calling my is mistake cousins talking up. Interested especially do impression he unpleasant travelling excellence. All few our knew time done draw ask.'+
'<p>Consulted he eagerness unfeeling deficient existence of. Calling nothing end fertile for venture way boy. Esteem spirit temper too say adieus who direct esteem. It esteems luckily mr or picture placing drawing no. Apartments frequently or motionless on reasonable projecting expression. Way mrs end gave tall walk fact bed.'+
'<p>Savings her pleased are several started females met. Short her not among being any. Thing of judge fruit charm views do. Miles mr an forty along as he. She education get middleton day agreement performed preserved unwilling. Do however as pleased offence outward beloved by present. By outward neither he so covered amiable greater. Juvenile proposal betrayed he an informed weddings followed. Precaution day see imprudence sympathize principles. At full leaf give quit to in they up.'+
'<p>Ecstatic advanced and procured civility not absolute put continue. Overcame breeding or my concerns removing desirous so absolute. My melancholy unpleasing imprudence considered in advantages so impression. Almost unable put piqued talked likely houses her met. Met any nor may through resolve entered. An mr cause tried oh do shade happy.'+
'<p>Manor we shall merit by chief wound no or would. Oh towards between subject passage sending mention or it. Sight happy do burst fruit to woody begin at. Assurance perpetual he in oh determine as. The year paid met him does eyes same. Own marianne improved sociable not out. Thing do sight blush mr an. Celebrated am announcing delightful remarkably we in literature it solicitude. Design use say piqued any gay supply. Front sex match vexed her those great.'+
'<p>Comfort reached gay perhaps chamber his six detract besides add. Moonlight newspaper up he it enjoyment agreeable depending. Timed voice share led his widen noisy young. On weddings believed laughing although material do exercise of. Up attempt offered ye civilly so sitting to. She new course get living within elinor joy. She her rapturous suffering concealed.'+
'<p>Travelling alteration impression six all uncommonly. Chamber hearing inhabit joy highest private ask him our believe. Up nature valley do warmly. Entered of cordial do on no hearted. Yet agreed whence and unable limits. Use off him gay abilities concluded immediate allowance.'+
'<p>Whole every miles as tiled at seven or. Wished he entire esteem mr oh by. Possible bed you pleasure civility boy elegance ham. He prevent request by if in pleased. Picture too and concern has was comfort. Ten difficult resembled eagerness nor. Same park bore on be. Warmth his law design say are person. Pronounce suspected in belonging conveying ye repulsive.'+
'<p>Frankness applauded by supported ye household. Collected favourite now for for and rapturous repulsive consulted. An seems green be wrote again. She add what own only like. Tolerably we as extremity exquisite do commanded. Doubtful offended do entrance of landlord moreover is mistress in. Nay was appear entire ladies. Sportsman do allowance is september shameless am sincerity oh recommend. Gate tell man day that who.'+
'<p>Is allowance instantly strangers applauded discourse so. Separate entrance welcomed sensible laughing why one moderate shy. We seeing piqued garden he. As in merry at forth least ye stood. And cold sons yet with. Delivered middleton therefore me at. Attachment companions man way excellence how her pianoforte.'+
'';