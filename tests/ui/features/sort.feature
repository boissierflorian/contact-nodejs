Feature: User can sort last names
  As a user

  Scenario: User sorts contacts by last name
    Given The contact list is displayed
    When User clicks on the sort button
    Then The contact list is sorted by last name