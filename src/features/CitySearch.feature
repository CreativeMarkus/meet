Feature: City search

  Scenario: User can search for events by city
    Given the user has opened the app
    When the user types "Berlin" into the city search input
    And selects "Berlin, Germany" from the suggestions
    Then the event list updates to show events in "Berlin"

  Scenario: User can view suggestions as they type
    Given the user focuses on the city search input
    When the user types "Ber"
    Then suggestions including "Berlin, Germany" are shown
