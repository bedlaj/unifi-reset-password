[![Total alerts](https://img.shields.io/lgtm/alerts/g/bedlaj/unifi-reset-password.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/bedlaj/unifi-reset-password/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/bedlaj/unifi-reset-password.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/bedlaj/unifi-reset-password/context:javascript)
[![codecov](https://codecov.io/gh/bedlaj/unifi-reset-password/branch/master/graph/badge.svg)](https://codecov.io/gh/bedlaj/unifi-reset-password)
![Lint](https://github.com/bedlaj/unifi-reset-password/workflows/Lint/badge.svg)
![Build](https://github.com/bedlaj/unifi-reset-password/workflows/Build/badge.svg)
![Test and Deploy to GH pages](https://github.com/bedlaj/unifi-reset-password/workflows/Test%20and%20Deploy%20to%20GH%20pages/badge.svg)

# Unifi reset admin password

Live APP at https://bedlaj.github.io/unifi-reset-password/

This app helps with reset of forgotten admin password, or creation of new admin account.
All is generated in Your browser. No data are collected and nothing is sent over the internet.

If you are concerned about privacy, you can checkout this repository and run app locally on the offline computer.
```
git clone https://github.com/bedlaj/unifi-reset-password.git
cd unifi-reset-password
npm install -g @angular/cli
npm install
npm start
# Open http://localhost:4200 in your browser
```

# Contributing
I love contributions. If you have found something missing, or something which could be done better, feel free to fork and open PR.

# Credits
[sha512.js](https://github.com/bedlaj/unifi-reset-password/blob/master/src/utils/sha512.js) is inspired by [mvo5/sha512crypt-node](https://github.com/mvo5/sha512crypt-node), which is based on [sha512.js by Paul Johnston](http://pajhome.org.uk/crypt/md5/sha512.html)
