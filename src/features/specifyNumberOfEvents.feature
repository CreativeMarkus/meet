Feature: Specify Number of Events

  As a user
  I want to specify how many events are displayed
  So that I can control the length of the event list

  Scenario: When user hasn’t specified a number, 32 events are shown by default
    Given the user hasn't specified a number of events
    When the user opens the app
    Then 32 events are displayed

  Scenario: User can change the number of events displayed
    Given the user is viewing the list of events
    When the user sets the number of events to 5
    Then only 5 events are displayed
