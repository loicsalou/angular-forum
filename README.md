[![GitHub license](https://img.shields.io/github/license/hamzahamidi/angular-forum.svg)](https://github.com/hamzahamidi/angular-forum)


> ### Angular project containing real world examples (CRUD, auth, advanced patterns, etc).

# ![Angular Forum App](logo.png)


### [Demo](http://hamidihamza.com/angular-forum)&nbsp;&nbsp;&nbsp;&nbsp;

This codebase was created to demonstrate a fully fledged application built with Angular that interacts with an actual backend server including CRUD operations, authentication, routing, pagination, and more.


# Comment démarrer

- Si pas déjà fait installer nodejs (version récente)
- Si pas déjà fait installer gloablement [Angular CLI](https://github.com/angular/angular-cli#installation) 
Commande à utiliser: _npm i -g @angular/cli_ 

Pour lancer l'application localement lancer `ng serve` et naviguer vers `http://localhost:4200/`. 
L'application se rechargera automatiquement à chaque changement dans le code source. 

# Builder le project en mode production
Exécuter `ng build`. 
Le résultat du build se trouvera dans le répertoire `dist/`.

# Functionality overview

The example application is a social blogging site (i.e. a Medium.com clone). You can view a live demo over at http://hamidihamza.com/angular-forum/

**General functionality:**

- Authenticate users via JWT (login/signup pages + logout button on settings page)
- CRU* users (sign up & settings page - no deleting required)
- CRUD messages
- CR*D Comments on messages (no updating required)
- GET and display paginated lists of messages
- Favorite messages
- Follow other users

**The general page breakdown looks like this:**

- Home page (URL: /#/ )
    - List of tags
    - List of messages pulled from either Feed, Global, or by Tag
    - Pagination for list of messages
- Sign in/Sign up pages (URL: /#/login, /#/register )
    - Uses JWT (store the token in localStorage)
    - Authentication can be easily switched to session/cookie based
- Settings page (URL: /#/settings )
- Editor page to create/edit messages (URL: /#/editor, /#/editor/message-slug-here )
- Message page (URL: /#/message/message-slug-here )
    - Delete message button (only shown to message's author)
    - Render markdown from server client side
    - Comments section at bottom of page
    - Delete comment button (only shown to comment's author)
- Profile page (URL: /#/profile/:username, /#/profile/:username/favorites )
    - Show basic user info
    - List of messages populated from author's created messages or author's favorited messages
