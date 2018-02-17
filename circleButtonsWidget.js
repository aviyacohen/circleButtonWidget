const circleButtonsWidget = (mainRadiusFactor, options) => {
    // Define vh and vw
    const vh = window.innerHeight/100;
    const vw = window.innerWidth/100;
    // Check for display ratio
    let mainRadius;
    const isHorizontal = (window.innerWidth > window.innerHeight) ? true : false;
    (isHorizontal) ? mainRadius = mainRadiusFactor*vh : mainRadius = mainRadiusFactor*vw ;
    // Set anchor in window center
    let anchor = {left: (vw*50), top: (vh*50)};
    let border = 1;
    
    // Wrap in settings object.
    const settings = {
        vh,
        vw,
        mainRadius,
        anchor,
        border
    }
    // Start building menu
    const wrapper = buildWrapper(settings, options);
    anchorize(anchor, wrapper);

    const mainMenuDiv = wrapper.appendChild(buildMainMenuDiv(wrapper, settings, options));

    const buttonWrapper = document.createElement("div");
    buttonWrapper.setAttribute("id", "buttonWrapper");
    buttonWrapper.style.position = "absolute";
    buttonWrapper.style.height = "inherit";
    buttonWrapper.style.width = "inherit";
    buttonWrapper.style.zIndex = "1";
    
    const buttons = buildButtons(wrapper, settings, options);
    for(button of buttons){
        buttonWrapper.appendChild(button)
    };
    
    wrapper.appendChild(buttonWrapper);
    let justDragged = false;
    // Events:
    mainMenuDiv.addEventListener("click", () => {
        if(!justDragged) {
            toggleSpread(mainRadius, buttons);
        } else {
            justDragged = false;
        }
    });
    let initialMousePos = {};
    let hasMoved = false;
    
    const setInitialMousePos = (event) => {
        let initialAdjustment = mainRadius/2;
        (hasMoved) ? initialAdjustment = 0 : undefined;
        initialMousePos.x = event.clientX + initialAdjustment;
        initialMousePos.y = event.clientY + initialAdjustment;
        hasMoved = true;
        window.addEventListener("mousemove", moveDiv);
    }

    const moveDiv = (event) => {
        let mousePos = {x: event.clientX, y: event.clientY}
        settings.anchor.left = settings.anchor.left - (initialMousePos.x - mousePos.x);
        settings.anchor.top = settings.anchor.top - (initialMousePos.y - mousePos.y);
        wrapper.style.left = settings.anchor.left + "px";
        wrapper.style.top = settings.anchor.top + "px";
        initialMousePos.x = mousePos.x;
        initialMousePos.y = mousePos.y;
        justDragged = true;
    }
    
    mainMenuDiv.addEventListener("mousedown", setInitialMousePos);
        
    window.addEventListener("mouseup", ()=>{
        window.removeEventListener("mousemove", moveDiv);
    })



    window.addEventListener("resize", ()=>{
        wrapper.innerHTML = "";
        circleButtonsWidget(mainRadiusFactor, options);
    });
}

const buildWrapper = (settings, options)=>{
    const wrapper = document.querySelector("#circleButtonsWidgetWrapper");
    wrapper.setAttribute("id", "circleButtonsWidgetWrapper");
    wrapper.style.position = "absolute";
    wrapper.style.width  = settings.mainRadius + 'px';
    wrapper.style.height  = settings.mainRadius + 'px';
    return wrapper;
}

const buildMainMenuDiv =  (wrapper, settings, options) => {
    mainMenuDiv = document.createElement("div");
    mainMenuDiv.style.height = getHeightNum(wrapper) + "px";
    mainMenuDiv.style.width = getWidthNum(wrapper) + "px";
    mainMenuDiv.style.borderRadius = mainMenuDiv.style.width;
    mainMenuDiv.style.boxShadow = `inset 0px 0px 0px ${settings.border}px ${options.mainColor}`;
    mainMenuDiv.style.backgroundColor = `${options.bodyBackground}`;
    mainMenuDiv.style.cursor = "pointer";
    mainMenuDiv.style.position = "absolute";
    mainMenuDiv.style.zIndex = "2";

    const icon = document.createElement('i');
    icon.setAttribute("class", `fa fa-cogs`);
    icon.style.position = "absolute";
    icon.style.color = `${options.iconsColor}`;
    icon.style.width = mainMenuDiv.style.width;
    icon.style.textAlign = "center";
    icon.style.fontSize = (Number(mainMenuDiv.style.width.slice(0,-2)) / 2) + "px";
    icon.style.top = (Number(mainMenuDiv.style.width.slice(0,-2))/4) + "px";

    mainMenuDiv.addEventListener("mouseenter", ()=>{
        mainMenuDiv.style.backgroundColor = "black";
    });
    mainMenuDiv.addEventListener("mouseleave", ()=>{
        mainMenuDiv.style.backgroundColor = options.bodyBackground;
     });
    
    mainMenuDiv.appendChild(icon);
    
    return mainMenuDiv;
}


const buildButtons = (wrapper, settings, options) => {
    const buttons = [];
    for(let i=0 ; i < options.buttonsNum ; i++){
        let button = document.createElement("div");
        button.setAttribute("id", `button-${i}`);
        button.setAttribute("data-button-index", `${i}`);
        button.setAttribute("class", "button");
        
        // Set button radius according to the mainMenu radius
        const buttonRadius = (getHeightNum(wrapper) / (options.buttonsNum / 2))
        
        button.style.height = buttonRadius + "px";
        button.style.width = buttonRadius + "px";
        button.style.borderRadius = button.style.width;
        button.style.boxShadow = `inset 0px 0px 0px ${settings.border}px ${options.mainColor}`;
        button.style.backgroundColor = `${options.bodyBackground}`;
        button.style.position = "absolute";
        button.style.opacity = 0;
        button.style.display = "none";
        button.style.zIndex = "1";
        button.style.cursor = "pointer";

        // Append icon to button
        const icon = button.appendChild(createButtonIcon(buttonRadius, options.buttonIcons[i], options.iconsColor));
        
        centerize(wrapper, button);
        buttons[i] = button;


        // Button events
        console.log(button);
        button.addEventListener("mouseenter", ()=>{
            button.style.backgroundColor = `black`;
        });
        button.addEventListener("mouseleave", ()=>{
            button.style.backgroundColor = options.bodyBackground;
        });
        button.addEventListener("click", ()=>{
            let allIcons = button.parentElement.querySelectorAll('i');
            for(i=0;i<allIcons.length;i++){
                allIcons[i].style.color = `${options.iconsColor}`;
            }
            button.querySelector("i").style.color = `${options.secondaryColor}`;
            const clickButton = setTimeout(()=>{
                button.style.backgroundColor = options.bodyBackground;
            }, 50);
            let buttonIndex = Number(button.getAttribute("data-button-index"));
            rotate(settings, options, document.querySelector("div#buttonWrapper"), 1500, "fullSwing", buttonIndex);

            // Run user set onClick function
            options.onClick(buttonIndex);
        });
    }
    return buttons;
}

const createButtonIcon = (buttonRadius, iconName, iconColor) => {
    const icon = document.createElement('i');
    icon.setAttribute("class", `fas fa-${iconName}`);
    icon.style.color = `${iconColor}`;
    icon.style.marginTop = buttonRadius/3 + "px";
    icon.style.fontSize = buttonRadius/3 + "px";
    icon.style.width = buttonRadius + "px";
    icon.style.textAlign = "center";

    return icon;
}



/************************/
/* Pos & Calc functions */
/************************/

const anchorize = (anchor, element) => {
    element.style.top = anchor.top - (getHeightNum(element) /2) + "px";
    element.style.left = anchor.left - (getWidthNum(element) /2) + "px";
}

const centerize = (wrapper, element) => {
    element.style.top = getHeightNum(wrapper)/2 - (getHeightNum(element)/2) + "px";
    element.style.left = getWidthNum(wrapper)/2 - (getWidthNum(element)/2) + "px";
}

const getHeightNum  = (element) => Number(element.style.height.slice(0, -2));
const getWidthNum  = (element) => Number(element.style.width.slice(0, -2));
const mathSinDegrees = (angle) => Math.sin(angle / 180  * Math.PI);
const mathCosDegrees = (angle) => Math.cos(angle / 180  * Math.PI);


/************************/
/*   Effect Functions   */
/************************/

const toggleFade = (element, duration, swingType) => {
    if(Number(element.style.opacity) === 0){
        fadeIn(element, duration, swingType);
    } else if (Number(element.style.opacity) === 1){
        fadeOut(element, duration, swingType);
    }
}

const toggleSpread = (mainRadius, buttons) => {
    if(buttons[0].style.display === "none"){
        spreadCircle(mainRadius, buttons);
    } else {
        constrainCircle(mainRadius, buttons);
    }
}

const fadeIn = (element, duration, swingType) => {
    if(Number(element.style.opacity) > 0) {
        return undefined;
    }

    let result = 0;
    let counter = 0;
    let angle = 0;
    let angleStep = 180/100;
    let resultFunc;
    element.style.display = "block";

    switch(swingType){
        case "halfSwing":
            resultFunc = swingFactor => swingFactor;
            break;
        case "fullSwing":
            angle = -90;
            angleStep = 360/100;
            resultFunc = swingFactor => (swingFactor + 1) / 2;
        default:
        break;
    }

    const fadeIn =  setInterval(function(){
        angle = angle + angleStep;
        swingFactor = mathSinDegrees(angle);
        result = resultFunc(swingFactor);
        counter = counter + 1;
        element.style.opacity = result;
        // End loop at full opacity.
        (result >= 1) ? clearInterval(fadeIn) : undefined;
    }, duration/50);
}

const fadeOut = (element, duration, swingType) => {
    if(Number(element.style.opacity) < 1) {
        return undefined;
    }

    let result = 1;
    let counter = 0;
    let angle = 90;
    let angleStep = 180/100;
    let resultFunc;
    switch(swingType){
        case "halfSwing":
            resultFunc = swingFactor => swingFactor;
            break;
        case "fullSwing":
            angleStep = 360/100;
            resultFunc = swingFactor => (swingFactor + 1) / 2;
        default:
        break;
    }
    const fadeOut =  setInterval(function(){
        angle = angle - angleStep;
        swingFactor = mathSinDegrees(angle);
        result = resultFunc(swingFactor);
        counter = counter + 1;
        element.style.opacity = result;
        // End loop at full opacity.
        if(result <= 0) {
            clearInterval(fadeOut);
            element.style.display = "none";
        }
    }, duration/50);
}


const spreadCircle = (mainRadius, buttons) =>{
    const circleRadius = mainRadius/2;
    for(i=0; i<buttons.length; i++) {
        const angle = (360/buttons.length) * i;
        const buttonRadius = (Number(buttons[i].style.width.slice(0, -2)/2));
        const distance = circleRadius + buttonRadius*2;
        const delta = getDeltaFromAnchor(angle, distance);

        toggleFade(buttons[i], 50, "fullSwing");
        animateMove(buttons[i], delta, 100);
    }
}

const constrainCircle = (mainRadius, buttons) =>{
    const circleRadius = mainRadius/2;
    for(i=0; i<buttons.length; i++) {
        const angle = (360/buttons.length) * i;
        const buttonRadius = (Number(buttons[i].style.width.slice(0, -2)/2));
        const distance = (circleRadius + buttonRadius*2) * -1;
        const delta = getDeltaFromAnchor(angle, distance);

        toggleFade(buttons[i], 50, "fullSwing");
        animateMove(buttons[i], delta, 100);
    }
}

function getDeltaFromAnchor(angle, distance) {
    const angleFactorLeft = mathCosDegrees(angle);
    const left = angleFactorLeft * distance;
    
    const angleFactorTop = mathSinDegrees(angle);
    const top = angleFactorTop * distance;
    
    return {left, top};
}

function animateMove(element, delta, duration) {
    let posLeft = Number(element.style.left.slice(0, -2));
    let posTop = Number(element.style.top.slice(0, -2));
    const stepLeft = delta.left / 50;
    const stepTop = delta.top / 50;
    let counter = 0;

    const animateMove = setInterval(()=>{
        posLeft = posLeft + stepLeft; 
        posTop = posTop + stepTop;
        element.style.left = `${posLeft}px`;
        element.style.top = `${posTop}px`;
        counter = counter + 1;
        (counter > 49) ? clearInterval(animateMove) : undefined;
    }, duration/50);
}

function rotate(settings, options, element, duration, swingType, buttonIndex){
    let fullRotation = 360 - (buttonIndex * (360/options.buttonsNum));
    let result = 0;
    let counter = 0;
    let angle = 0;
    let angleStep = 180/100;
    let resultFunc;
    let initialRotation = 0;
    if (element.style.transform.match(/([0-9]+)/)){
        initialRotation = Number(element.style.transform.match(/([0-9]+)/)[0]);
        if(initialRotation > 360) {
            initialRotation = initialRotation - 360;
        }
        let compensationIndex = ((360 - initialRotation) / (360/options.buttonsNum) );
        fullRotation = 360 - ((buttonIndex - compensationIndex) * (360/options.buttonsNum));
        (fullRotation >= 360) ? fullRotation = fullRotation - 360 : undefined; 
    }
    const icons = element.querySelectorAll('i');
    element.style.display = "block";

    switch(swingType){
        case "halfSwing":
            resultFunc = swingFactor => swingFactor;
            break;
        case "fullSwing":
            angle = -90;
            angleStep = 360/100;
            resultFunc = swingFactor => (swingFactor + 1) / 2;
        default:
        break;
    }

    duration = duration * (fullRotation/360);
    const rotationInterval =  setInterval(function(){
        angle = angle + angleStep;
        swingFactor = mathSinDegrees(angle);
        result = resultFunc(swingFactor) * fullRotation + initialRotation;
        counter = counter + 1;
        element.style.transform = `rotate(${result}deg)`;

        for(i=0;i<icons.length;i++){
            let negResult = result * (-1);
            icons[i].style.transform = `rotate(${negResult}deg)`
        }
        // End loop at full opacity.
        (result >= fullRotation + initialRotation) ? clearInterval(rotationInterval) : undefined;
    }, duration/50);
}

// Demo notify click display

const notify = (buttonIndex) => {
    const notification = document.createElement("p");

    notification.style.display = "none";
    notification.style.opacity = "0";
    notification.style.position = "absolute";
    notification.style.padding = "2vw";
    notification.style.borderRadius = "8px";
    notification.style.boxShadow = `inset 0px 0px 0px 1px white`;
    notification.style.height = "5vh";
    notification.style.right = "1vw";
    notification.style.bottom = "1vw";
    notification.style.fontSize = "2vw";
    notification.style.color = `white`;
    notification.textAlign = 'center';

    const text = `You clicked button number:\t ${buttonIndex}`;
    const textNode = document.createTextNode(text);

    notification.appendChild(textNode);
    document.body.appendChild(notification);
    toggleFade(notification, 200, "fullSwing");
    setTimeout(()=>{
        toggleFade(notification, 200, "fullSwing");
        document.body.removeChild(notification);
    }, 800)
}