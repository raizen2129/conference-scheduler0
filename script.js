const form = document.getElementById("meetingForm");
const meetingList = document.getElementById("meetingList");
const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");

let meetings = JSON.parse(localStorage.getItem("meetings")) || [];

let currentDate = new Date();



function saveMeetings(){
    localStorage.setItem("meetings", JSON.stringify(meetings));
}



form.addEventListener("submit", function(e){

    e.preventDefault();

    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const participants = document.getElementById("participants").value;
    const description = document.getElementById("description").value;

    const meeting = {
        id: Date.now(),
        title,
        date,
        time,
        participants,
        description
    };

    meetings.push(meeting);

    saveMeetings();

    form.reset();

    renderMeetings();
    renderCalendar();

});



function deleteMeeting(id){

    meetings = meetings.filter(m => m.id !== id);

    saveMeetings();

    renderMeetings();
    renderCalendar();

}



function renderMeetings(){

    meetingList.innerHTML = "";

    meetings.sort((a,b)=> new Date(a.date) - new Date(b.date));

    meetings.forEach(m => {

        const li = document.createElement("li");
        li.className = "meeting-item";

        li.innerHTML = `
<strong>${m.title}</strong><br>
📅 ${m.date} ⏰ ${m.time}<br>
👥 ${m.participants}<br>
<p>${m.description}</p>
`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", () => {
            deleteMeeting(m.id);
        });

        li.appendChild(deleteBtn);

        meetingList.appendChild(li);

    });

}


function renderCalendar(){

    calendar.innerHTML="";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.innerText =
        currentDate.toLocaleString("default",{month:"long"})+" "+year;

    const firstDay = new Date(year,month,1).getDay();
    const daysInMonth = new Date(year,month+1,0).getDate();

    for(let i=0;i<firstDay;i++){
        const blank=document.createElement("div");
        calendar.appendChild(blank);
    }

    for(let d=1; d<=daysInMonth; d++){

        const dayDiv=document.createElement("div");
        dayDiv.className="day";

        const dateStr=`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

        dayDiv.innerHTML=`<div class="day-number">${d}</div>`;

        meetings.forEach(m=>{
            if(m.date===dateStr){
                const event=document.createElement("div");
                event.className="event";
                event.innerText=m.title;
                dayDiv.appendChild(event);
            }
        });

        calendar.appendChild(dayDiv);

    }

}



document.getElementById("prevMonth").onclick=()=>{
    currentDate.setMonth(currentDate.getMonth()-1);
    renderCalendar();
};

document.getElementById("nextMonth").onclick=()=>{
    currentDate.setMonth(currentDate.getMonth()+1);
    renderCalendar();
};



renderMeetings();
renderCalendar();