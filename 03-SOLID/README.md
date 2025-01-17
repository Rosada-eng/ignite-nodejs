# FiendAFriend API

This API allows NGOs to register their pets for adoption. It has mainly a learning purpose and is part of Rocketseat Learning Program in NodeJS.

## Project Requirements

This API has two main stakeholders:

- **NGOs**: Organizations that takes care of pets and register them for adoption.
- **Users**: Users are interested in adopting pets according to their capabilities of adopting.

The API must fulfill those requirements:

As a NGO, ...

1. I want to register a pet for adoption
   1.1 A adoption must have a PET.
   1.1.1 A PET must have: - name - age - energy level (1-5) - size (small, medium, big) - space for living (small, medium, big)
   1.2 A adoption must have a responsible NGO.
   1.3 A adoption must have a set of adoption requirements or preferences.
   1.4 Only NGO can register a PET adoption.

2. I want to remove adoptions not available anymore

   2.1 Only NGO can remove adoptions already taken.
   2.2 NGO can remove only adoptions registered by them.

3. I want to register as a NGO
   3.1 A NGO must have:
   - name
   - email
   - password
   - address
   - zipcode
   - city
   - state
   - phone

As a USER, ...

4. I want to find a pet for adoption
   4.1 Adoptions search must be done by city level
   4.2 Filters might be applied by pet's characteristics
   4.2.1 I want to filter by Age Category (baby, young, adult, senior)
   4.2.2 I want to filter by Energy Level (low, medium, high)
   4.2.3 I want to filter by Size (small, medium, big)
   4.2.4 I want to filter by Space for Living (small, medium, big)
5. I want to filter available pets according to their characteristics

6. I want to check details about an adoption.

NFR:

- A user must no be logged in to search for adoptions.
- A NGO must be authenticated in order to perform admin's actions.

This application has an interface mock for inspirations in [Figma](https://www.figma.com/community/file/1220006040435238030)
