This project was created with [Django](https://www.djangoproject.com/).

In order for you to be able to run the application, you must first run:
* `pip install -r requirements.txt`
* `python manage.py makemigrations`
* `python manage.py migrate`
* `python manage.py runserver`

## Available Scripts

In the project directory, you can run:

### `python manage.py makemigrations`

Responsible for creating new migrations based on the changes you have made to your models. 
If you run the project for the first time, first run this script.

### `python manage.py migrate`

Responsible for applying and not applying migrations.
If there is no database (SQlite), one will be created with all migrations.
If you run the project for the first time, run this script after running `python manage.py makemigrations`

For others databases engines look at [databases](https://docs.djangoproject.com/en/3.1/ref/databases/)

### `python manage.py runserver`

Runs the app in the development mode if debug mode is disabled or in production mode if debug mode is enabled.<br />
Open [http://127.0.0.1:8000](http://127.0.0.1:8000) to view it in the browser.

In debug mode the page will reload if you make edits. In case debug mode is disabled, you should stop the server and re run it again in order of the new changes to take effect<br />
You will also see any lint errors in the console.

### `python manage.py test`

Launches the test runner in the interactive watch mode.<br />
See the section about [writing and running tests](https://docs.djangoproject.com/en/3.1/topics/testing/) for more information.


## Learn more about Django

You can learn more in the [Django documentation](https://www.djangoproject.com/).


# Specification

This project corresponds to a series of projects covered by the course [CS50’s Web Programming with Python and JavaScript](https://cs50.harvard.edu/web/2020/)

* Send Mail: A user is able of send text-based emails. 
* Mailbox: When a user visits their Inbox, Sent Mailbox, or Archive, the corresponding mailbox is loaded.
* View Email: When a user clicks on an email, the user is taken to a view where they see the content of that email.
* Archive and Unarchive: Users can archive and unarchive emails that they have received.
* Reply: Users are able to reply to an email.

