/* config file */

var CONFIG = {
  'year': 2016,
  'ewsUser': '',
  'ewsPassword': '',
  'introExceptedPaths': ['Virtual City Hall', 'eAgenda'],
  'introToCityExceptedPaths': ['Information Technology'],
  'hrmenu': {
    'Emerging Leaders': {
      'menutitle': 'Emerging Leaders',
      'description': 'These courses are recommended for frontline staff who relieve as a Supervisor/Foreman and /or are preparing for their next role.'
    },
    'Foundation Leaders': {
      'menutitle': 'Foundation Leadership<br> Skills for Supervisors<br>and Managers',
      'description': 'These courses are recommended for all staff who lead a team and want to gain greater skill and confidence in their role as a supervisor or manager.'
    },
    'Advanced Leaders': {
      'menutitle': 'Advanced Leadership <br>Skills for Managers',
      'description': 'These courses are recommended for staff who manage and have already completed the Foundation Leadership courses.'
    },
    'Ongoing Leaders': {
      'menutitle': 'Ongoing Leadership<br>Development',
      'description': 'These courses are recommended for all Leadership staff who wish to gain more depth in a topic relevant to their work and their skills.'
    }
  },
  'hrcatalog': [
    { 'name': 'Your Learning', 'competencies': ['Systems', 'Self', 'Social', 'Strategy', ''] },
    { 'name': 'Your Career', 'competencies': [''] },
    { 'name': 'Learning for the City', 'competencies': [''] }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
