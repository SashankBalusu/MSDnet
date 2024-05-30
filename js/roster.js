const Grade = {
  FRESHMAN: Symbol('Freshman'),
  SOPHOMORE: Symbol('Sophomore'),
  JUNIOR: Symbol('Junior'),
  SENIOR: Symbol('Senior'),
}

class TeamMember {
  name;                   // @type: string
  grade;                  // @type: Grade
  eventsAttended = [];    // type: list[Event]

  constructor(name, grade) {
    this.name = name;
    this.grade = grade;
  }

  add_event(eventAttended) {
    this.eventsAttended.push(eventAttended)
  }
}

class TeamRoster {
  constructor() {
    // this.class_list
  }
}

class Event {
  eventType;
  supposedToAttend;
}
