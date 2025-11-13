Feature: Event listing and filtering

  Scenario: Default number of events is 32
    Given the user opens the app
    Then the app lists 32 events by default

  Scenario: User can change number of events
    Given the user opens the app
    When the user changes the number of events to 10
    Then the list updates to show 10 events
