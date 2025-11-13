Feature: Show/Hide Event Details

  Scenario: An event element is collapsed by default
    Given the user has opened the app
    When the user views the list of events
    Then the details for each event should be hidden by default

  Scenario: User can expand an event to see details
    Given the user has opened the app
    And the list of events is displayed
    When the user expands an event
    Then the event's details should be shown

  Scenario: User can collapse an event to hide details
    Given an event's details are currently visible
    When the user collapses the event
    Then the event's details should be hidden
