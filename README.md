# MovieFy🎬🎶

MovieFy is a web application built to streamline the process of finding and creating Spotify playlists inspired by movies. Users can search by movie title and retrieve playlists that others have already associated with the film, removing the need to sift through multiple options or select tracks to match the movie’s atmosphere. This functionality enables users to quickly create or save playlists that reflect the movie’s theme.

## Core Features and Functionality
1. **Spotify Authentication and Authorization:** MovieFy uses Spotify's OAuth 2.0 for secure authentication, enabling users to log in with their Spotify account.
2. **Movie-Related Playlist Search:** Users can search for playlists based on a desired movie title. MovieFy sends API requests to Spotify to retrieve relevant music, populating the interface with the fetched tracks.
3. **Refresh Functionality:** Users can retrieve more track options using the refresh feature to fetch additional music selections.
4. **Playlist Creation:** Users can create a new Spotify playlist that will be added to their Spotify library.

## Project Technologies
MovieFy's primary technologies and frameworks:

- **Python & FastAPI:** The backend is built with FastAPI to handle user authentication with Spotify, manage API requests, sessions, and routing.
- **API Integration:** MovieFy interacts directly with the Spotify API to perform various operations on Spotify data.
- **ReactJS:** The application's frontend utilizes ReactJS to create a dynamic and responsive frontend.

## Project Overview

#### Spotify OAuth Process
![Spotify OAuth](extras/Moviefy%20Spotify%20OAuth%20Sequence%20Diagram.jpeg)


#### Searching Sequence
![Searching Process](extras/Moviefy%20Application%20Sequence%20Diagram.jpeg)


## Roadmap
This spotify search tool is a passion project of mine and it is currently functional; however, it is no longer deployed due to cost related issues. I do have plans in the future to deploy it. Thank you for checking out my Spotify Search Tool! If you have any questions or feedback, feel free to reach out.

