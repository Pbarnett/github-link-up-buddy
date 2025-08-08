Web forms
Overview: Extension modules


Next


This module provides a series of articles that will help you master the essentials of web forms. Web forms are a very powerful tool for interacting with users — most commonly they are used for collecting data from users, or allowing them to control a user interface. However, for historical and technical reasons, it's not always obvious how to use them to their full potential. In the articles listed below, we'll cover all the essential aspects of Web forms including marking up their HTML structure, styling form controls, validating form data, and submitting data to the server.
Prerequisites
Before starting this module, you should at least work through our Introduction to HTML. At this point you should find the Introductory tutorials easy to understand, and also be able to make use of our Basic native form controls tutorial.
Mastering forms however requires more than just HTML knowledge — you also need to learn some specific techniques to style form controls, and some scripting knowledge is required to handle things like validation and creating custom form controls. Therefore, before you look at the other sections listed below we'd recommend that you go away and learn some CSS and JavaScript first.
The above text is a good indicator as to why we've put web forms into its own standalone module, rather than trying to mix bits of it into the HTML, CSS, and JavaScript topic areas — form elements are more complex than most other HTML elements, and they also require a close marriage of related CSS and JavaScript techniques to get the most out of them.
Note: If you are working on a computer, tablet, or another device where you can't create files, you can try running the code in an online editor such as CodePen or JSFiddle.
Introductory tutorials
Your first form
The first article in our series provides your very first experience of creating a web form, including designing a simple form, implementing it using the right HTML elements, adding some very simple styling via CSS, and how data is sent to a server.
How to structure a web form
With the basics out of the way, we now look in more detail at the elements used to provide structure and meaning to the different parts of a form.
The different form controls
Basic native form controls
We start off this section by looking at the functionality of the original HTML <input> types in detail, looking at what options are available to collect different types of data.
The HTML5 input types
Here we continue our deep dive into the <input> element, looking at the additional input types provided when HTML5 was released, and the various UI controls and data collection enhancements they provide. Additionally, we look at the <output> element.
Other form controls
Next we take a look at all the non-<input> form controls and associated tools, such as <select>, <textarea>, <meter>, and <progress>.
Form styling tutorials
Styling web forms
This article provides an introduction to styling forms with CSS, including all the basics you might need to know for basic styling tasks.
Advanced form styling
Here we look at some more advanced form styling techniques that need to be used when trying to deal with some of the more difficult-to-style form elements.
Customizable select elements
This article explains how to use dedicated, modern HTML and CSS features together to create fully-customized <select> elements. This includes having full control over styling the select button, drop-down picker, arrow icon, current selection checkmark, and each individual <option> element.
UI pseudo-classes
An introduction to the UI pseudo-classes enabling HTML form controls to be targeted based on their current state.
Validating and submitting form data
Client-side form validation
Sending data is not enough — we also need to make sure that the data users enter into forms is in the correct format to process it successfully, and that it won't break our applications. We also want to help our users to fill out our forms correctly and not get frustrated when trying to use our apps. Form validation helps us achieve these goals — this article tells you what you need to know.
Sending form data
This article looks at what happens when a user submits a form — where does the data go, and how do we handle it when it gets there? We also look at some of the security concerns associated with sending form data.
Additional articles
The following articles aren't included in the learning pathway, but they'll prove interesting and useful when you've mastered the above techniques and want to know more.
How to build custom form controls
You'll come across some cases where the native form widgets just don't provide what you need, e.g., because of styling or functionality. In such cases, you may need to build your own form widget out of raw HTML. This article explains how you'd do this and the considerations you need to be aware of when doing so, with a practical case study.
Sending forms through JavaScript
This article looks at ways to use a form to assemble an HTTP request and send it via custom JavaScript, rather than standard form submission. It also looks at why you'd want to do this, and the implications of doing so. (See also Using FormData objects.)
Customizable select elements
This article explains how to use dedicated, modern HTML and CSS features together to create fully-customized <select> elements.
See also
HTML forms element reference
HTML <input> types reference
HTML attribute reference
User input methods and controls




Your first form
Overview: Web forms


Next


The first article in our series provides you with your very first experience of creating a web form, including designing a simple form, implementing it using the right HTML form controls and other HTML elements, adding some very simple styling via CSS, and describing how data is sent to a server. We'll expand on each of these subtopics in more detail later on in the module.
Prerequisites:
A basic understanding of HTML.
Objective:
To gain familiarity with what web forms are, what they are used for, how to think about designing them, and the basic HTML elements you'll need for simple cases.

What are web forms?
Web forms are one of the main points of interaction between a user and a website or application. Forms allow users to enter data, which is generally sent to a web server for processing and storage (see Sending form data later in the module), or used on the client-side to immediately update the interface in some way (for example, add another item to a list, or show or hide a UI feature).
A web form's HTML is made up of one or more form controls (sometimes called widgets), plus some additional elements to help structure the overall form — they are often referred to as HTML forms. The controls can be single or multi-line text fields, dropdown boxes, buttons, checkboxes, or radio buttons, and are mostly created using the <input> element, although there are some other elements to learn about too.
Form controls can also be programmed to enforce specific formats or values to be entered (form validation), and paired with text labels that describe their purpose to both sighted and visually impaired users.
Designing your form
Before starting to code, it's always better to step back and take the time to think about your form. Designing a quick mockup will help you to define the right set of data you want to ask your user to enter. From a user experience (UX) point of view, it's important to remember that the bigger your form, the more you risk frustrating people and losing users. Keep it simple and stay focused: ask only for the data you absolutely need.
Designing forms is an important step when you are building a site or application. It's beyond the scope of this article to cover the user experience of forms, but if you want to dig into that topic you should read the following articles:
Smashing Magazine has some good articles about forms UX, including an older but still relevant Extensive Guide To Web Form Usability article.
UXMatters is also a very thoughtful resource with good advice from basic best practices to complex concerns such as multipage forms.
In this article, we'll build a simple contact form. Let's make a rough sketch.

Our form will contain three text fields and one button. We are asking the user for their name, their email and the message they want to send. Hitting the button will send their data to a web server.
Active learning: Implementing our form HTML
Ok, let's have a go at creating the HTML for our form. We will use the following HTML elements: <form>, <label>, <input>, <textarea>, and <button>.
Before you go any further, make a local copy of our simple HTML template — you'll enter your form HTML into here.
The <form> element
All forms start with a <form> element, like this:
html
Copy to Clipboard
<form action="/my-handling-form-page" method="post">…</form>

This element formally defines a form. It's a container element like a <section> or <footer> element, but specifically for containing forms; it also supports some specific attributes to configure the way the form behaves. All of its attributes are optional, but it's standard practice to always set at least the action and method attributes:
The action attribute defines the location (URL) where the form's collected data should be sent when it is submitted.
The method attribute defines which HTTP method to send the data with (usually get or post).
Note: We'll look at how those attributes work in our Sending form data article later on.
For now, add the above <form> element into your HTML <body>.
The <label>, <input>, and <textarea> elements
Our contact form is not complex: the data entry portion contains three text fields, each with a corresponding <label>:
The input field for the name is a single-line text field.
The input field for the email is an input of type email: a single-line text field that accepts only email addresses.
The input field for the message is a <textarea>; a multiline text field.
In terms of HTML code we need something like the following to implement these form widgets:
html
Copy to Clipboard
<form action="/my-handling-form-page" method="post">
  <p>
    <label for="name">Name:</label>
    <input type="text" id="name" name="user_name" />
  </p>
  <p>
    <label for="mail">Email:</label>
    <input type="email" id="mail" name="user_email" />
  </p>
  <p>
    <label for="msg">Message:</label>
    <textarea id="msg" name="user_message"></textarea>
  </p>
</form>

Update your form code to look like the above.
The <p> elements are there to conveniently structure our code and make styling easier (see later in the article). For usability and accessibility, we include an explicit label for each form control. Note the use of the for attribute on all <label> elements, which takes as its value the id of the form control with which it is associated — this is how you associate a form control with its label.
There is great benefit to doing this — it associates the label with the form control, enabling mouse, trackpad, and touch device users to click on the label to activate the corresponding control, and it also provides an accessible name for screen readers to read out to their users. You'll find further details of form labels in How to structure a web form.
On the <input> element, the most important attribute is the type attribute. This attribute is extremely important because it defines the way the <input> element appears and behaves. You'll find more about this in the Basic native form controls article later on.
In our simple example, we use the value text for the first input — the default value for this attribute. It represents a basic single-line text field that accepts any kind of text input.
For the second input, we use the value email, which defines a single-line text field that only accepts a well-formed email address. This turns a basic text field into a kind of "intelligent" field that will perform some validation checks on the data typed by the user. It also causes a more appropriate keyboard layout for entering email addresses (e.g., with an @ symbol by default) to appear on devices with dynamic keyboards, like smartphones. You'll find out more about form validation in the client-side form validation article later on.
Last but not least, note the syntax of <input> vs. <textarea></textarea>. This is one of the oddities of HTML. The <input> tag is a void element, meaning that it doesn't need a closing tag. <textarea> is not a void element, meaning it should be closed with the proper ending tag. This has an impact on a specific feature of forms: the way you define the default value. To define the default value of an <input> element you have to use the value attribute like this:
html
Copy to Clipboard
<input type="text" value="by default this element is filled with this text" />

On the other hand, if you want to define a default value for a <textarea>, you put it between the opening and closing tags of the <textarea> element, like this:
html
Copy to Clipboard
<textarea>
by default this element is filled with this text
</textarea>

The <button> element
The markup for our form is almost complete; we just need to add a button to allow the user to send, or "submit", their data once they have filled out the form. This is done by using the <button> element; add the following just above the closing </form> tag:
html
Copy to Clipboard
<p class="button">
  <button type="submit">Send your message</button>
</p>

The <button> element also accepts a type attribute — this accepts one of three values: submit, reset, or button.
A click on a submit button (the default value) sends the form's data to the web page defined by the action attribute of the <form> element.
A click on a reset button resets all the form widgets to their default value immediately. From a UX point of view, this is considered bad practice, so you should avoid using this type of button unless you really have a good reason to include one.
A click on a button button does nothing! That sounds silly, but it's amazingly useful for building custom buttons — you can define their chosen functionality with JavaScript.
Note: You can also use the <input> element with the corresponding type to produce a button, for example <input type="submit">. The main advantage of the <button> element is that the <input> element only allows plain text in its label whereas the <button> element allows full HTML content, allowing more complex, creative button content.
Basic form styling
Now that you have finished writing your form's HTML code, try saving it and looking at it in a browser. At the moment, you'll see that it looks rather ugly.
Note: If you don't think you've got the HTML code right, try comparing it with our finished example — see first-form.html (also see it live).
Forms are notoriously tricky to style nicely. It is beyond the scope of this article to teach you form styling in detail, so for the moment we will just get you to add some CSS to make it look OK.
First of all, add a <style> element to your page, inside your HTML head. It should look like so:
html
Copy to Clipboard
<style>
  /* CSS goes here */
</style>

Inside the style tags, add the following CSS:
css
Copy to Clipboard
body {
  /* Center the form on the page */
  text-align: center;
}

form {
  display: inline-block;
  /* Form outline */
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 1em;
}

p + p {
  margin-top: 1em;
}

label {
  /* Uniform size & alignment */
  display: inline-block;
  min-width: 90px;
  text-align: right;
}

input,
textarea {
  /* To make sure that all text fields have the same font settings
     By default, text areas have a monospace font */
  font: 1em sans-serif;
  /* Uniform text field size */
  width: 300px;
  box-sizing: border-box;
  /* Match form field borders */
  border: 1px solid #999;
}

input:focus,
textarea:focus {
  /* Set the outline width and style */
  outline-style: solid;
  /* To give a little highlight on active elements */
  outline-color: #000;
}

textarea {
  /* Align multiline text fields with their labels */
  vertical-align: top;
  /* Provide space to type some text */
  height: 5em;
}

.button {
  /* Align buttons with the text fields */
  padding-left: 90px; /* same size as the label elements */
}

button {
  /* This extra margin represent roughly the same space as the space
     between the labels and their text fields */
  margin-left: 0.5em;
}

Save and reload, and you'll see that your form should look much less ugly.
Note: You can find our version on GitHub at first-form-styled.html (also see it live).
Sending form data to your web server
The last part, and perhaps the trickiest, is to handle form data on the server side. The <form> element defines where and how to send the data thanks to the action and method attributes.
We provide a name attribute for each form control. The names are important on both the client- and server-side; they tell the browser which name to give each piece of data and, on the server side, they let the server handle each piece of data by name. The form data is sent to the server as name/value pairs.
To name the data in a form, you need to use the name attribute on each form widget that will collect a specific piece of data. Let's look at some of our form code again:
html
Copy to Clipboard
<form action="/my-handling-form-page" method="post">
  <p>
    <label for="name">Name:</label>
    <input type="text" id="name" name="user_name" />
  </p>
  <p>
    <label for="mail">Email:</label>
    <input type="email" id="mail" name="user_email" />
  </p>
  <p>
    <label for="msg">Message:</label>
    <textarea id="msg" name="user_message"></textarea>
  </p>

  …
</form>

In our example, the form will send 3 pieces of data named user_name, user_email, and user_message. That data will be sent to the URL /my-handling-form-page using the HTTP POST method.
On the server side, the script at the URL /my-handling-form-page will receive the data as a list of 3 key/value items contained in the HTTP request. The way this script will handle that data is up to you. Each server-side language (PHP, Python, Ruby, Java, C#, etc.) has its own mechanism of handling form data. It's beyond the scope of this tutorial to go deeply into that subject, but if you want to know more, we have provided some examples in our Sending form data article later on.
Summary
Congratulations, you've built your first web form. It looks like this live:
play
That's only the beginning, however — now it's time to take a deeper look. Forms have way more power than what we saw here and the other articles in this module will help you to master the rest.
How to structure a web form
Previous


Overview: Web forms


Next


With the basics out of the way, we'll now look in more detail at the elements used to provide structure and meaning to the different parts of a form.
Prerequisites:
A basic understanding of HTML.
Objective:
To understand how to structure HTML forms and give them semantics so they are usable and accessible.

The flexibility of forms makes them one of the most complex structures in HTML; you can build any kind of basic form using dedicated form elements and attributes. Using the correct structure when building an HTML form will help ensure that the form is both usable and accessible.
The <form> element
The <form> element formally defines a form and attributes that determine the form's behavior. Each time you want to create an HTML form, you must start it by using this element, nesting all the contents inside. Many assistive technologies and browser plugins can discover <form> elements and implement special hooks to make them easier to use.
We already met this in the previous article.
Warning: It's strictly forbidden to nest a form inside another form. Nesting can cause forms to behave unpredictably, so it is a bad idea.
It's always possible to use a form control outside of a <form> element. If you do so, by default that control has nothing to do with any form unless you associate it with a form using its form attribute. This was introduced to let you explicitly bind a control with a form even if it is not nested inside it.
Let's move forward and cover the structural elements you'll find nested in a form.
The <fieldset> and <legend> elements
The <fieldset> element is a convenient way to create groups of widgets that share the same purpose, for styling and semantic purposes. You can label a <fieldset> by including a <legend> element just below the opening <fieldset> tag. The text content of the <legend> formally describes the purpose of the <fieldset> it is included inside.
Many assistive technologies will use the <legend> element as if it is a part of the label of each control inside the corresponding <fieldset> element. For example, some screen readers such as Jaws and NVDA will speak the legend's content before speaking the label of each control.
Here is a little example:
html
Copy to Clipboard
<form>
  <fieldset>
    <legend>Fruit juice size</legend>
    <p>
      <input type="radio" name="size" id="size_1" value="small" />
      <label for="size_1">Small</label>
    </p>
    <p>
      <input type="radio" name="size" id="size_2" value="medium" />
      <label for="size_2">Medium</label>
    </p>
    <p>
      <input type="radio" name="size" id="size_3" value="large" />
      <label for="size_3">Large</label>
    </p>
  </fieldset>
</form>

Note: You can find this example in fieldset-legend.html (see it live also).
When reading the above form, a screen reader will speak "Fruit juice size small" for the first widget, "Fruit juice size medium" for the second, and "Fruit juice size large" for the third.
The use case in this example is one of the most important. Each time you have a set of radio buttons, you should nest them inside a <fieldset> element. There are other use cases, and in general the <fieldset> element can also be used to section a form. Ideally, long forms should be spread across multiple pages, but if a form is getting long and must be on a single page, putting the different related sections inside different fieldsets improves usability.
Because of its influence over assistive technology, the <fieldset> element is one of the key elements for building accessible forms; however, it is your responsibility not to abuse it. If possible, each time you build a form, try to listen to how a screen reader interprets it. If it sounds odd, try to improve the form structure.
The <label> element
As we saw in the previous article, the <label> element is the formal way to define a label for an HTML form widget. This is the most important element if you want to build accessible forms — when implemented properly, screen readers will speak a form element's label along with any related instructions, as well as it being useful for sighted users. Take this example, which we saw in the previous article:
html
Copy to Clipboard
<label for="name">Name:</label> <input type="text" id="name" name="user_name" />

With the <label> associated correctly with the <input> via its for attribute (which contains the <input> element's id attribute), a screen reader will read out something like "Name, edit text".
There is another way to associate a form control with a label — nest the form control within the <label>, implicitly associating it.
html
Copy to Clipboard
<label for="name">
  Name: <input type="text" id="name" name="user_name" />
</label>

Even in such cases however, it is considered best practice to set the for attribute to ensure all assistive technologies understand the relationship between label and widget.
If there is no label, or if the form control is neither implicitly nor explicitly associated with a label, a screen reader will read out something like "Edit text blank", which isn't very helpful at all.
Labels are clickable, too!
Another advantage of properly set up labels is that you can click or tap the label to activate the corresponding widget. This is useful for controls like text inputs, where you can click the label as well as the input to focus it, but it is especially useful for radio buttons and checkboxes — the hit area of such a control can be very small, so it is useful to make it as easy to activate as possible.
For example, clicking on the "I like cherry" label text in the example below will toggle the selected state of the taste_cherry checkbox:
html
Copy to Clipboard
<form>
  <p>
    <input type="checkbox" id="taste_1" name="taste_cherry" value="cherry" />
    <label for="taste_1">I like cherry</label>
  </p>
  <p>
    <input type="checkbox" id="taste_2" name="taste_banana" value="banana" />
    <label for="taste_2">I like banana</label>
  </p>
</form>

Note: You can find this example in checkbox-label.html (see it live also).
Multiple labels
Strictly speaking, you can put multiple labels on a single widget, but this is not a good idea as some assistive technologies can have trouble handling them. In the case of multiple labels, you should nest a widget and its labels inside a single <label> element.
Let's consider this example:
html
Copy to Clipboard
play
<p>Required fields are followed by <span aria-label="required">*</span>.</p>

<!-- So this: -->
<!--<div>
  <label for="username">Name:</label>
  <input id="username" type="text" name="username" required />
  <label for="username"><span aria-label="required">*</span></label>
</div>-->

<!-- would be better done like this: -->
<!--<div>
  <label for="username">
    <span>Name:</span>
    <input id="username" type="text" name="username" required />
    <span aria-label="required">*</span>
  </label>
</div>-->

<!-- But this is probably best: -->
<div>
  <label for="username">Name: <span aria-label="required">*</span></label>
  <input id="username" type="text" name="username" required />
</div>

play
The paragraph at the top states a rule for required elements. The rule must be included before it is used so that sighted users and users of assistive technologies such as screen readers can learn what it means before they encounter a required element. While this helps inform users what an asterisk means, it can not be relied upon. A screen reader will speak an asterisk as "star" when encountered. When hovered by a sighted mouse user, "required" should appear, which is achieved by use of the title attribute. Titles being read aloud depends on the screen reader's settings, so it is more reliable to also include the aria-label attribute, which is always read by screen readers.
The above variants increase in effectiveness as you go through them:
In the first example, the label is not read out at all with the input — you just get "edit text blank", plus the actual labels are read out separately. The multiple <label> elements confuse the screen reader.
In the second example, things are a bit clearer — the label read out along with the input is "name star name edit text required", and the labels are still read out separately. Things are still a bit confusing, but it's a bit better this time because the <input> has a label associated with it.
The third example is best — the actual label is read out all together, and the label read out with the input is "name required edit text".
Note: You might get slightly different results, depending on your screen reader. This was tested in VoiceOver (and NVDA behaves similarly). We'd love to hear about your experiences too.
Note: You can find this example on GitHub as required-labels.html (see it live also). Don't test the example with 2 or 3 of the versions uncommented — screen readers will definitely get confused if you have multiple labels AND multiple inputs with the same ID!
Common HTML structures used with forms
Beyond the structures specific to web forms, it's good to remember that form markup is just HTML. This means that you can use all the power of HTML to structure a web form.
As you can see in the examples, it's common practice to wrap a label and its widget with a <li> element within a <ul> or <ol> list. <p> and <div> elements are also commonly used. Lists are recommended for structuring multiple checkboxes or radio buttons.
In addition to the <fieldset> element, it's also common practice to use HTML titles (e.g., h1, h2) and sectioning (e.g., <section>) to structure complex forms.
Above all, it is up to you to find a comfortable coding style that results in accessible, usable forms. Each separate section of functionality should be contained in a separate <section> element, with <fieldset> elements to contain radio buttons.
Building a form structure
Let's put these ideas into practice and build a slightly more involved form — a payment form. This form will contain a number of control types that you may not yet understand. Don't worry about this for now; you'll find out how they work in the next article (Basic native form controls). For now, read the descriptions carefully as you follow the below instructions, and start to form an appreciation of which wrapper elements we are using to structure the form, and why.
To start with, make a local copy of our blank template file in a new directory on your computer.
Next, create your form by adding a <form> element:
html
Copy to Clipboard
play
<form>


Inside the <form> element, add a heading and paragraph to inform users how required fields are marked:
html
Copy to Clipboard
play
<h1>Payment form</h1>
<p>
  Required fields are followed by
  <strong><span aria-label="required">*</span></strong>.
</p>


Next, we'll add a larger section of code into the form, below our previous entry. Here you'll see that we are wrapping the contact information fields inside a distinct <section> element. Moreover, we have a set of three radio buttons, each of which we are putting inside its own list (<li>) element. We also have two standard text <input>s and their associated <label> elements, each contained inside a <p>, and a password input for entering a password. Add this code to your form:
html
Copy to Clipboard
play
<section>
  <h2>Contact information</h2>
  <fieldset>
    <legend>Title</legend>
    <ul>
      <li>
        <label for="title_1">
          <input type="radio" id="title_1" name="title" value="A" />
          Ace
        </label>
      </li>
      <li>
        <label for="title_2">
          <input type="radio" id="title_2" name="title" value="K" />
          King
        </label>
      </li>
      <li>
        <label for="title_3">
          <input type="radio" id="title_3" name="title" value="Q" />
          Queen
        </label>
      </li>
    </ul>
  </fieldset>
  <p>
    <label for="name">
      <span>Name: </span>
      <strong><span aria-label="required">*</span></strong>
    </label>
    <input type="text" id="name" name="username" required />
  </p>
  <p>
    <label for="mail">
      <span>Email: </span>
      <strong><span aria-label="required">*</span></strong>
    </label>
    <input type="email" id="mail" name="user-mail" required />
  </p>
  <p>
    <label for="pwd">
      <span>Password: </span>
      <strong><span aria-label="required">*</span></strong>
    </label>
    <input type="password" id="pwd" name="password" required />
  </p>
</section>


The second <section> of our form is the payment information. We have three distinct controls along with their labels, each contained inside a <p>. The first is a drop-down menu (<select>) for selecting credit card type. The second is an <input> element of type tel, for entering a credit card number; while we could have used the number type, we don't want the number's spinner UI. The last one is an <input> element of type text, for entering the expiration date of the card; this includes a placeholder attribute indicating the correct format, and a pattern that tests that the entered date has the correct format. These newer input types are reintroduced in The HTML5 input types.
Enter the following below the previous section:
html
Copy to Clipboard
play
<section>
  <h2>Payment information</h2>
  <p>
    <label for="card">
      <span>Card type:</span>
    </label>
    <select id="card" name="user-card">
      <option value="visa">Visa</option>
      <option value="mc">Mastercard</option>
      <option value="amex">American Express</option>
    </select>
  </p>
  <p>
    <label for="number">
      <span>Card number:</span>
      <strong><span aria-label="required">*</span></strong>
    </label>
    <input type="tel" id="number" name="card-number" required />
  </p>
  <p>
    <label for="expiration">
      <span>Expiration date:</span>
      <strong><span aria-label="required">*</span></strong>
    </label>
    <input
      type="text"
      id="expiration"
      name="expiration"
      required
      placeholder="MM/YY"
      pattern="^(0[1-9]|1[0-2])\/([0-9]{2})$" />
  </p>
</section>


The last section we'll add is a lot simpler, containing only a <button> of type submit, for submitting the form data. Add this to the bottom of your form now:
html
Copy to Clipboard
play
<section>
  <p>
    <button type="submit">Validate the payment</button>
  </p>
</section>


Finally, complete your form by adding the outer <form> closing tag:
html
Copy to Clipboard
play
</form>


We applied some extra CSS to the finished form below. If you'd like to make changes to the appearance of your form, you can copy styles from the example or visit Styling web forms.
play
Summary
You now have all the knowledge you'll need to properly structure your web forms. We will cover many of the features introduced here in the next few articles, with the next article looking in more detail at using all the different types of form widgets you'll want to use to collect information from your users.
Basic native form controls
Previous


Overview: Web forms


Next


In the previous article, we marked up a functional web form example, introducing some form controls and common structural elements, and focusing on accessibility best practices. Next, we will look at the functionality of the different form controls, or widgets, in detail — studying all the different options available to collect different types of data. In this particular article, we will look at the original set of form controls, available in all browsers since the early days of the web.
Prerequisites:
A basic understanding of HTML.
Objective:
To understand in detail the original set of native form widgets available in browsers for collecting data, and how to implement them using HTML.

You've already met some form elements, including <form>, <fieldset>, <legend>, <textarea>, <label>, <button>, and <input>. This article covers:
The common input types button, checkbox, file, hidden, image, password, radio, reset, submit, and text.
Some of the attributes that are common to all form controls.
Note: We cover additional, more powerful form controls in the next two articles. If you want a more advanced reference, you should consult our HTML forms element reference, and in particular our extensive <input> types reference.
Text input fields
Text <input> fields are the most basic form widgets. They are a very convenient way to let the user enter any kind of data, and we've already seen a few simple examples.
Note: HTML form text fields are simple plain text input controls. This means that you cannot use them to perform rich text editing (bold, italic, etc.). All rich text editors you'll encounter are custom widgets created with HTML, CSS, and JavaScript.
All basic text controls share some common behaviors:
They can be marked as readonly (the user cannot modify the input value but it is still sent with the rest of the form data) or disabled (the input value can't be modified and is never sent with the rest of the form data).
They can have a placeholder; this is the text that appears inside the text input box that should be used to briefly describe the purpose of the box.
They can be constrained in size (the physical size of the box) and maxlength (the maximum number of characters that can be entered into the box).
They can benefit from spell-checking (using the spellcheck attribute).
Note: The <input> element is unique amongst HTML elements because it can take many forms depending on its type attribute value. It is used for creating most types of form widgets including single line text fields, time and date controls, controls without text input like checkboxes, radio buttons, and color pickers, and buttons.
Single line text fields
A single line text field is created using an <input> element whose type attribute value is set to text, or by omitting the type attribute altogether (text is the default value). The value text for this attribute is also the fallback value if the value you specify for the type attribute is unknown by the browser (for example if you specify type="color" and the browser doesn't support native color pickers).
Note: You can find examples of all the single line text field types on GitHub at single-line-text-fields.html (see it live also).
Here is a basic single line text field example:
html
Copy to Clipboard
<input type="text" id="comment" name="comment" value="I'm a text field" />

Single line text fields have only one true constraint: if you type text with line breaks, the browser removes those line breaks before sending the data to the server.
The screenshot below shows a text input in default, focused, and disabled states. Most browsers indicate the focused state using a focus ring around the control and the disabled state using grey text or a faded/semi-opaque control.

The screenshots used in this document were taken in the Chrome browser on macOS. There may be minor variations in these fields/buttons across different browsers, but the basic highlighting technique remains similar.
Note: We discuss values for the type attribute that enforce specific validation constraints including color, email, and url input types, in the next article, The HTML5 input types.
Password field
One of the original input types was the password text field type:
html
Copy to Clipboard
<input type="password" id="pwd" name="pwd" />

The following screenshot shows Password input field in which each input character is shown as a dot.

The password value doesn't add any special constraints to the entered text, but it does obscure the value entered into the field (e.g., with dots or asterisks) so it can't be easily read by others.
Keep in mind this is just a user interface feature; unless you submit your form securely, it will get sent in plain text, which is bad for security — a malicious party could intercept your data and steal passwords, credit card details, or whatever else you've submitted. The best way to protect users from this is to host any pages involving forms over a secure connection (i.e., located at an https:// address), so the data is encrypted before it is sent.
Browsers recognize the security implications of sending form data over an insecure connection, and have warnings to deter users from using insecure forms. For more information on what Firefox implements, see Insecure passwords.
Hidden content
Another original text control is the hidden input type. This is used to create a form control that is invisible to the user, but is still sent to the server along with the rest of the form data once submitted — for example you might want to submit a timestamp to the server stating when an order was placed. Because it is hidden, the user can not see nor intentionally edit the value, it will never receive focus, and a screen reader will not notice it either.
html
Copy to Clipboard
<input type="hidden" id="timestamp" name="timestamp" value="1286705410" />

If you create such an element, it's required to set its name and value attributes. The value can be dynamically set via JavaScript. The hidden input type should not have an associated label.
Other text input types, like search, url, and tel, will be covered in the next tutorial, HTML5 input types.
Checkable items: checkboxes and radio buttons
Checkable items are controls whose state you can change by clicking on them or their associated labels. There are two kinds of checkable items: the checkbox and the radio button. Both use the checked attribute to indicate whether the widget is checked by default or not.
It's worth noting that these widgets do not behave exactly like other form widgets. For most form widgets, once the form is submitted all widgets that have a name attribute are sent, even if no value has been filled out. In the case of checkable items, their values are sent only if they are checked. If they are not checked, nothing is sent, not even their name. If they are checked but have no value, the name is sent with a value of on.
Note: You can find the examples from this section on GitHub as checkable-items.html (see it live also).
For maximum usability/accessibility, you are advised to surround each list of related items in a <fieldset>, with a <legend> providing an overall description of the list. Each individual pair of <label>/<input> elements should be contained in its own list item (or similar). The associated <label> is generally placed immediately before or after the radio button or checkbox, with the instructions for the group of radio button or checkboxes generally being the content of the <legend>. See the examples linked above for structural examples.
Checkbox
A checkbox is created using the <input> element with a type attribute set to the value checkbox.
html
Copy to Clipboard
<input type="checkbox" id="questionOne" name="subscribe" value="yes" checked />

Related checkbox items should use the same name attribute. Including the checked attribute makes the checkbox checked automatically when the page loads. Clicking the checkbox or its associated label toggles the checkbox on and off.
html
Copy to Clipboard
<fieldset>
  <legend>Choose all the vegetables you like to eat</legend>
  <ul>
    <li>
      <label for="carrots">Carrots</label>
      <input
        type="checkbox"
        id="carrots"
        name="vegetable"
        value="carrots"
        checked />
    </li>
    <li>
      <label for="peas">Peas</label>
      <input type="checkbox" id="peas" name="vegetable" value="peas" />
    </li>
    <li>
      <label for="cabbage">Cabbage</label>
      <input type="checkbox" id="cabbage" name="vegetable" value="cabbage" />
    </li>
  </ul>
</fieldset>

The following screenshot shows checkboxes in the default, focused, and disabled states. Checkboxes in the default and disabled states appear checked, whereas in the focused state, the checkbox is unchecked, with focus ring around it.

Note: Any checkboxes and radio buttons with the checked attribute on load match the :default pseudo-class, even if they are no longer checked. Any that are currently checked match the :checked pseudo-class.
Due to the on-off nature of checkboxes, the checkbox is considered a toggle button, with many developers and designers expanding on the default checkbox styling to create buttons that look like toggle switches. You can see an example in action here (also see the source code).
Radio button
A radio button is created using the <input> element with its type attribute set to the value radio:
html
Copy to Clipboard
<input type="radio" id="soup" name="meal" value="soup" checked />

Several radio buttons can be tied together. If they share the same value for their name attribute, they will be considered to be in the same group of buttons. Only one button in a given group may be checked at a time; this means that when one of them is checked all the others automatically get unchecked. When the form is sent, only the value of the checked radio button is sent. If none of them are checked, the whole pool of radio buttons is considered to be in an unknown state and no value is sent with the form. Once one of the radio buttons in a same-named group of buttons is checked, it is not possible for the user to uncheck all the buttons without resetting the form.
html
Copy to Clipboard
<fieldset>
  <legend>What is your favorite meal?</legend>
  <ul>
    <li>
      <label for="soup">Soup</label>
      <input type="radio" id="soup" name="meal" value="soup" checked />
    </li>
    <li>
      <label for="curry">Curry</label>
      <input type="radio" id="curry" name="meal" value="curry" />
    </li>
    <li>
      <label for="pizza">Pizza</label>
      <input type="radio" id="pizza" name="meal" value="pizza" />
    </li>
  </ul>
</fieldset>

The following screenshot shows default and disabled radio buttons in the checked state, along with a focused radio button in the unchecked state.

Actual buttons
The radio button isn't actually a button, despite its name; let's move on and look at actual buttons! There are three input types that produce buttons:
submit
Sends the form data to the server. For <button> elements, omitting the type attribute (or an invalid value of type) results in a submit button.
reset
Resets all form widgets to their default values.
button
Buttons that have no automatic effect but can be customized using JavaScript code.
Then we also have the <button> element itself. This can take a type attribute of value submit, reset, or button to mimic the behavior of the three <input> types mentioned above. The main difference between the two is that actual <button> elements are much easier to style.
html
Copy to Clipboard
play
<p>Using &lt;input></p>
<p>
  <input type="submit" value="Submit this form" />
  <input type="reset" value="Reset this form" />
  <input type="button" value="Do Nothing without JavaScript" />
</p>
<p>Using &lt;button></p>
<p>
  <button type="submit">Submit this form</button>
  <button type="reset">Reset this form</button>
  <button type="button">Do Nothing without JavaScript</button>
</p>

play
Note: The image input type also renders as a button. We'll cover that later too.
Note: You can find the examples from this section on GitHub as button-examples.html (see it live also).
Below you can find examples of each button <input> type, along with the equivalent <button> type.
submit
html
Copy to Clipboard
<button type="submit">This is a <strong>submit button</strong></button>

<input type="submit" value="This is a submit button" />

reset
html
Copy to Clipboard
<button type="reset">This is a <strong>reset button</strong></button>

<input type="reset" value="This is a reset button" />

anonymous
html
Copy to Clipboard
<button type="button">This is an <strong>anonymous button</strong></button>

<input type="button" value="This is an anonymous button" />

Buttons always behave the same whether you use a <button> element or an <input> element. As you can see from the examples, however, <button> elements let you use HTML in their content, which is inserted between the opening and closing <button> tags. <input> elements on the other hand are void elements; their displayed content is inserted inside the value attribute, and therefore only accepts plain text as content.
The following screenshot shows a button in the default, focused, and disabled states. In the focused state, there is a focus ring around the button, and in the disabled state, the button is greyed out.

Image button
The image button control is rendered exactly like an <img> element, except that when the user clicks on it, it behaves like a submit button.
An image button is created using an <input> element with its type attribute set to the value image. This element supports exactly the same set of attributes as the <img> element, plus all the attributes supported by other form buttons.
html
Copy to Clipboard
<input type="image" alt="Click me!" src="my-img.png" width="80" height="30" />

If the image button is used to submit the form, this control doesn't submit its value — instead, the X and Y coordinates of the click on the image are submitted (the coordinates are relative to the image, meaning that the upper-left corner of the image represents the coordinate (0, 0)). The coordinates are sent as two key/value pairs:
The X value key is the value of the name attribute followed by the string ".x".
The Y value key is the value of the name attribute followed by the string ".y".
So for example when you click on the image at coordinate (123, 456) and it submits via the get method, you'll see the values appended to the URL as follows:
url
Copy to Clipboard
http://foo.com?pos.x=123&pos.y=456

This is a very convenient way to build a "hot map". How these values are sent and retrieved is detailed in the Sending form data article.
File picker
There is one last <input> type that came to us in early HTML: the file input type. Forms are able to send files to a server (this specific action is also detailed in the Sending form data article). The file picker widget can be used to choose one or more files to send.
To create a file picker widget, you use the <input> element with its type attribute set to file. The types of files that are accepted can be constrained using the accept attribute. In addition, if you want to let the user pick more than one file, you can do so by adding the multiple attribute.
Example
In this example, a file picker is created that requests graphic image files. The user is allowed to select multiple files in this case.
html
Copy to Clipboard
<input type="file" name="file" id="file" accept="image/*" multiple />

On some mobile devices, the file picker can access photos, videos, and audio captured directly by the device's camera and microphone by adding capture information to the accept attribute like so:
html
Copy to Clipboard
<input type="file" accept="image/*;capture=camera" />
<input type="file" accept="video/*;capture=camcorder" />
<input type="file" accept="audio/*;capture=microphone" />

The following screenshot shows the file picker widget in the default, focus, and disabled states when no file is selected.

Common attributes
Many of the elements used to define form controls have some of their own specific attributes. However, there is a set of attributes common to all form elements. You've met some of these already, but below is a list of those common attributes, for your reference:
Attribute name
Default value
Description
autofocus
false
This Boolean attribute lets you specify that the element should automatically have input focus when the page loads. Only one form-associated element in a document can have this attribute specified.
disabled
false
This Boolean attribute indicates that the user cannot interact with the element. If this attribute is not specified, the element inherits its setting from the containing element, for example, <fieldset>; if there is no containing element with the disabled attribute set, then the element is enabled.
form


The <form> element that the widget is associated with, used if it is not nested within that form. The value of the attribute must be the id attribute of a <form> element in the same document. This lets you associate a form control with a form it is outside of, even if it is inside a different form element.
name


The name of the element; this is submitted with the form data.
value


The element's initial value.

Summary
This article has covered the older input types — the original set introduced in the early days of HTML that is well-supported in all browsers. In the next section, we'll take a look at the more modern values of the type attribute.

The HTML5 input types
Previous


Overview: Web forms


Next


In the previous article we looked at the <input> element, covering the original values of the type attribute available since the early days of HTML. Now we'll look in detail at the functionality of some input types that were added later.
Prerequisites:
A basic understanding of HTML.
Objective:
To understand the newer input type values available to create native form controls, and how to implement them using HTML.


Because HTML form control appearance may be quite different from a designer's specifications, web developers sometimes build their own custom form controls. We cover this in an advanced tutorial: How to build custom form widgets.
Email address field
This type of field is set using the value email for the type attribute:
html
Copy to Clipboard
play
<input type="email" id="email" name="email" />


play
When this type is used, the value must be an email address to be valid. Any other content causes the browser to display an error when the form is submitted. You can see this in action in the screenshot below.

You can use the multiple attribute in combination with the email input type to allow several comma-separated email addresses to be entered in the same input:
html
Copy to Clipboard
<input type="email" id="email" name="email" multiple />
On some devices — notably, touch devices with dynamic keyboards like smartphones — a different virtual keypad might be presented that is more suitable for entering email addresses, including the @ key:

Note: You can find examples of the basic text input types at basic input examples (see the source code also).
This is another good reason for using these newer input types, improving the user experience for users of these devices.
Client-side validation
As you can see above, email — along with other newer input types — provides built-in client-side error validation, performed by the browser before the data gets sent to the server. It is a helpful aid to guide users to fill out a form accurately, and it can save time: it is useful to know that your data is not correct immediately, rather than having to wait for a round trip to the server.
But it should not be considered an exhaustive security measure! Your apps should always perform security checks on any form-submitted data on the server-side as well as the client-side, because client-side validation is too easy to turn off, so malicious users can still easily send bad data through to your server. Read Website security for an idea of what could happen; implementing server-side validation is somewhat beyond the scope of this module, but you should bear it in mind.
Note that a@b is a valid email address according to the default provided constraints. This is because the email input type allows intranet email addresses by default. To implement different validation behavior, you can use the pattern attribute. You can also customize the error messages. We'll talk about how to use these features in the Client-side form validation article later on.
Note: If the data entered is not an email address, the :invalid pseudo-class will match, and the validityState.typeMismatch property will return true.
Search field
Search fields are intended to be used to create search boxes on pages and apps. This type of field is set by using the value search for the type attribute:
html
Copy to Clipboard
play
<input type="search" id="search" name="search" />


play
The main difference between a text field and a search field is how the browser styles its appearance. In some browsers, search fields are rendered with rounded corners. In some browsers, an "Ⓧ" clear icon is displayed, which clears the field of any value when clicked. This clear icon only appears if the field has a value, and, apart from Safari, it is only displayed when the field is focused. Additionally, on devices with dynamic keyboards, the keyboard's enter key may read "search", or display a magnifying glass icon.
Another worth-noting feature is that the values of a search field can be automatically saved and re-used to offer auto-completion across multiple pages of the same website; this tends to happen automatically in most modern browsers.
Phone number field
A special field for filling in phone numbers can be created using tel as the value of the type attribute:
html
Copy to Clipboard
play
<input type="tel" id="tel" name="tel" />


play
When accessed via a touch device with a dynamic keyboard, most devices will display a numeric keypad when type="tel" is encountered, meaning this type is useful whenever a numeric keypad is useful, and doesn't just have to be used for telephone numbers.
-
Due to the wide variety of phone number formats around the world, this type of field does not enforce any constraints on the value entered by a user (this means it may include letters, etc.).
As we mentioned earlier, the pattern attribute can be used to enforce constraints, which you'll learn about in Client-side form validation.
URL field
A special type of field for entering URLs can be created using the value url for the type attribute:
html
Copy to Clipboard
play
<input type="url" id="url" name="url" />


play
It adds special validation constraints to the field. The browser will report an error if no protocol (such as http:) is entered, or if the URL is otherwise malformed. On devices with dynamic keyboards, the default keyboard will often display some or all of the colon, period, and forward slash as default keys.
Note: Just because the URL is well-formed doesn't necessarily mean that it refers to a location that actually exists!
Numeric field
Controls for entering numbers can be created with an <input> type of number. This control looks like a text field but allows only floating-point numbers, and usually provides buttons in the form of a spinner to increase and decrease the value of the control. On devices with dynamic keyboards, the numeric keyboard is generally displayed.
html
Copy to Clipboard
play
<input type="number" id="number" name="number" />


play
With the number input type, you can constrain the minimum and maximum values allowed by setting the min and max attributes.
You can also use the step attribute to set the increment increase and decrease caused by pressing the spinner buttons. By default, the number input type only validates if the number is an integer, as the step attribute defaults to 1. To allow float numbers, specify step="any" or a specific value, like step="0.01" to restrict the floating point. If omitted, as the step value defaults to 1, only whole numbers are valid.
Let's look at some examples:
This example creates a number control whose valid value is restricted to an odd value between 1 and 10. The increase and decrease buttons change the value by 2, starting with the min value.
html
Copy to Clipboard
play
<input type="number" name="age" id="age" min="1" max="10" step="2" />


play
This example creates a number control whose value is restricted to any value between 0 and 1 inclusive, and whose increase and decrease buttons change its value by 0.01.
html
Copy to Clipboard
play
<input type="number" name="change" id="pennies" min="0" max="1" step="0.01" />


play
The number input type makes sense when the range of valid values is limited, such as a person's age or height. If the range is too large for incremental increases to make sense (such as USA ZIP codes, which range from 00001 to 99999), the tel type might be a better option; it provides the numeric keypad while forgoing the number's spinner UI feature.
Slider controls
Another way to pick a number is to use a slider. You see these quite often on sites like shopping sites where you want to set a maximum property price to filter by. Let's look at a live example to illustrate this:
play
Usage-wise, sliders are less accurate than text fields. Therefore, they are used to pick a number whose precise value is not necessarily important.
A slider is created using the <input> with its type attribute set to the value range. The slider-thumb can be moved via mouse or touch, or with the arrows of the keypad.
It's important to properly configure your slider. To that end, it's highly recommended that you set the min, max, and step attributes which set the minimum, maximum, and increment values, respectively.
Let's look at the code behind the above example, so you can see how it's done. First of all, the basic HTML:
html
Copy to Clipboard
play
<label for="price">Choose a maximum house price: </label>
<input
  type="range"
  name="price"
  id="price"
  min="50000"
  max="500000"
  step="1000"
  value="250000" />
<output class="price-output" for="price"></output>
This example creates a slider whose value may range between 50000 and 500000, which increments/decrements by 1000 at a time. We've given it a default value of 250000, using the value attribute.
One problem with sliders is that they don't offer any kind of visual feedback as to what the current value is. This is why we've included an <output> element to contain the current value. You could display an input value or the output of a calculation inside any element, but <output> is special — like <label> — and it can take a for attribute that allows you to associate it with the element or elements that the output value came from.
To actually display the current value, and update it as it changes, you must use JavaScript, which can be accomplished with a few statements:
js
Copy to Clipboard
play
const price = document.querySelector("#price");
const output = document.querySelector(".price-output");

output.textContent = price.value;

price.addEventListener("input", () => {
  output.textContent = price.value;
});
Here we store references to the range input and the output in two variables. Then we immediately set the output's textContent to the current value of the input. Finally, an event listener is set to ensure that whenever the range slider is moved, the output's textContent is updated to the new value.
Date and time pickers
Generally, for a good user experience when gathering date and time values, it is important to provide a calendar selection UI. These enable users to select dates without needing to context switch to a native calendar application or potentially entering them in differing formats that are hard to parse. The last minute of the previous millennium can be expressed in the following different ways: 1999/12/31, 23:59, or 12/31/99T11:59PM.
HTML date controls are available to handle this specific kind of data, providing calendar widgets and making the data uniform.
A date and time control is created using the <input> element and an appropriate value for the type attribute, depending on whether you wish to collect dates, times, or both. Here's a live example:
play
Let's look at the different available types in brief. Note that the usage of these types is quite complex, especially considering browser support (see below); to find out the full details, follow the links below to the reference pages for each type, including detailed examples.
date
<input type="date"> creates a widget to display and pick a date (year, month, and day, with no time).
html
Copy to Clipboard
play
<input type="date" name="date" id="date" />


play
datetime-local
<input type="datetime-local"> creates a widget to display and pick a date with time with no specific time zone information.
html
Copy to Clipboard
play
<input type="datetime-local" name="datetime" id="datetime" />


play
month
<input type="month"> creates a widget to display and pick a month with a year.
html
Copy to Clipboard
play
<input type="month" name="month" id="month" />


play
time
<input type="time"> creates a widget to display and pick a time value. While time may display in 12-hour format, the value returned is in 24-hour format.
html
Copy to Clipboard
play
<input type="time" name="time" id="time" />


play
week
<input type="week"> creates a widget to display and pick a week number and its year.
Weeks start on Monday and run to Sunday. Additionally, the first week 1 of each year contains the first Thursday of that year — which may not include the first day of the year, or may include the last few days of the previous year.
html
Copy to Clipboard
play
<input type="week" name="week" id="week" />


play
Constraining date/time values
All date and time controls can be constrained using the min and max attributes, with further constraining possible via the step attribute (whose value varies according to input type).
html
Copy to Clipboard
play
<label for="myDate">When are you available this summer?</label><br />
<input
  type="date"
  name="myDate"
  min="2025-06-01"
  max="2025-08-31"
  step="7"
  id="myDate" />


play
Color picker control
Colors are always a bit difficult to handle. There are many ways to express them: RGB values (decimal or hexadecimal), HSL values, keywords, and so on.
A color control can be created using the <input> element with its type attribute set to the value color:
html
Copy to Clipboard
play
<input type="color" name="color" id="color" />


play
Clicking a color control generally displays the operating system's default color-picking functionality for you to choose. The value returned is always a lowercase 6-value hexadecimal color.
Summary
That brings us to the end of our tour of the HTML5 form input types. There are a few other control types that cannot be easily grouped due to their very specific behaviors but are still essential to know. We cover those in the next article.
Previous


Other form controls
Previous


Overview: Web forms


Next


We now look at the functionality of non-<input> form elements in detail, from other control types such as drop-down lists and multi-line text fields, to other useful form features such as the <output> element (which we saw in action in the previous article), and progress bars.
Prerequisites:
A basic understanding of HTML.
Objective:
To understand the non-<input> form features, and how to implement them using HTML.

Multi-line text fields
A multi-line text field is specified using a <textarea> element, rather than using the <input> element.
html
Copy to Clipboard
play
<textarea cols="30" rows="8"></textarea>

This renders like so:
play
The main difference between a <textarea> and a regular single-line text field is that users are allowed to include hard line breaks (i.e., pressing return) that will be included when the data is submitted.
<textarea> also takes a closing tag; any default text you want it to contain should be put between the opening and closing tags. In contrast, the <input> is a void element with no closing tag — any default value is put inside the value attribute.
Note that even though you can put anything inside a <textarea> element (including other HTML elements, CSS, and JavaScript), because of its nature, it is all rendered as if it was plain text content. (Using contenteditable on non-form controls provides an API for capturing HTML/"rich" content instead of plain text).
Visually, the text entered wraps and the form control is by default resizable. Most browsers provide a drag handle that you can drag to increase/decrease the size of the text area.
You can find an example of text area usage in the example we put together in the first article of this.
Controlling multi-line rendering
<textarea> accepts three attributes to control its rendering across several lines:
cols
Specifies the visible width (columns) of the text control, measured in average character widths. This is effectively the starting width, as it can be changed by resizing the <textarea>, and overridden using CSS. The default value if none is specified is 20.
rows
Specifies the number of visible text rows for the control. This is effectively the starting height, as it can be changed by resizing the <textarea>, and overridden using CSS. The default value if none is specified is 2.
wrap
Specifies how the control wraps text. The values are soft (the default value), which means the text submitted is not wrapped but the text rendered by the browser is wrapped; hard (the cols attribute must be specified when using this value), which means both the submitted and rendered texts are wrapped, and off, which stops wrapping.
Controlling textarea resizability
The ability to resize a <textarea> is controlled with the CSS resize property. Its possible values are:
both: The default — allows resizing horizontally and vertically.
horizontal: Allows resizing only horizontally.
vertical: Allows resizing only vertically.
none: Allows no resizing.
block and inline: Experimental values that allow resizing in the block or inline direction only (this varies depending on the directionality of your text; read Handling different text directions if you want to find out more.)
Play with the interactive example at the top of the resize reference page for a demonstration of how these work.
Drop-down controls
Drop-down controls are a simple way to let users select from many options without taking up much space in the user interface. HTML has two types of drop-down controls: the select box and the autocomplete box. The interaction is the same in both the types of drop-down controls — after the control is activated, the browser displays a list of values the user can select from.
Note: You can find examples of all the drop-down box types on GitHub at drop-down-content.html (see it live also).
Select box
A simple select box is created with a <select> element with one or more <option> elements as its children, each of which specifies one of its possible values.
Basic example
html
Copy to Clipboard
play
<select id="simple" name="simple">
  <option>Banana</option>
  <option selected>Cherry</option>
  <option>Lemon</option>
</select>

play
If required, the default value for the select box can be set using the selected attribute on the desired <option> element — this option is then preselected when the page loads.
Using optgroup
The <option> elements can be nested inside <optgroup> elements to create visually associated groups of values:
html
Copy to Clipboard
play
<select id="groups" name="groups">
  <optgroup label="fruits">
    <option>Banana</option>
    <option selected>Cherry</option>
    <option>Lemon</option>
  </optgroup>
  <optgroup label="vegetables">
    <option>Carrot</option>
    <option>Eggplant</option>
    <option>Potato</option>
  </optgroup>
</select>

play
On the <optgroup> element, the value of the label attribute is displayed before the values of the nested options. The browser usually sets them visually apart from the options (i.e., by being bolded and at a different nesting level) so they are less likely to be confused for actual options.
Using the value attribute
If an <option> element has an explicit value attribute set on it, that value is sent when the form is submitted with that option selected. If the value attribute is omitted, as with the examples above, the content of the <option> element is used as the value. So value attributes are not needed, but you might find a reason to want to send a shortened or different value to the server than what is visually shown in the select box.
For example:
html
Copy to Clipboard
<select id="simple" name="simple">
  <option value="banana">Big, beautiful yellow banana</option>
  <option value="cherry">Succulent, juicy cherry</option>
  <option value="lemon">Sharp, powerful lemon</option>
</select>

By default, the height of the select box is enough to display a single value. The optional size attribute provides control over how many options are visible when the select does not have focus.
Multiple choice select box
By default, a select box lets a user select only one value. By adding the multiple attribute to the <select> element, you can allow users to select several values. Users can select multiple values by using the default mechanism provided by the operating system (e.g., on the desktop, multiple values can be clicked while holding down Cmd/Ctrl keys).
html
Copy to Clipboard
play
<select id="multi" name="multi" multiple size="2">
  <optgroup label="fruits">
    <option>Banana</option>
    <option selected>Cherry</option>
    <option>Lemon</option>
  </optgroup>
  <optgroup label="vegetables">
    <option>Carrot</option>
    <option>Eggplant</option>
    <option>Potato</option>
  </optgroup>
</select>

play
Note: In the case of multiple choice select boxes, you'll notice that the select box no longer displays the values as drop-down content — instead, all values are displayed at once in a list, with the optional size attribute determining the height of the widget.
Note: All browsers that support the <select> element also support the multiple attribute.
Autocomplete box
You can provide suggested, automatically-completed values for form widgets using the <datalist> element with child <option> elements to specify the values to display. The <datalist> needs to be given an id.
The data list is then bound to an <input> element (e.g., a text or email input type) using the list attribute, the value of which is the id of the data list to bind.
Once a data list is affiliated with a form widget, its options are used to auto-complete text entered by the user; typically, this is presented to the user as a drop-down box listing possible matches for what they've typed into the input.
Basic example
Let's look at an example.
html
Copy to Clipboard
play
<label for="myFruit">What's your favorite fruit?</label>
<input type="text" name="myFruit" id="myFruit" list="mySuggestion" />
<datalist id="mySuggestion">
  <option>Apple</option>
  <option>Banana</option>
  <option>Blackberry</option>
  <option>Blueberry</option>
  <option>Lemon</option>
  <option>Lychee</option>
  <option>Peach</option>
  <option>Pear</option>
</datalist>

play
Less obvious datalist uses
According to the HTML specification, the list attribute and the <datalist> element can be used with any kind of widget requiring a user input. This leads to some uses of it that might seem a little non-obvious.
For example, in browsers that support <datalist> on range input types, a small tick mark will be displayed above the range for each datalist <option> value. You can see an implementation example of this on the <input type="range"> reference page.
And browsers that support <datalist>s and <input type="color"> should display a customized palette of colors as the default, while still making the full color palette available.
In this case, different browsers behave differently from case to case, so consider such uses as progressive enhancement, and ensure they degrade gracefully.
Other form features
There are a few other form features that are not as obvious as the ones we have already mentioned, but still useful in some situations, so we thought it would be worth giving them a brief mention.
Note: You can find the examples from this section on GitHub as other-examples.html (see it live also).
Meters and progress bars
Meters and progress bars are visual representations of numeric values. Support for <progress> and <meter> is available in all modern browsers.
Meter
A meter bar represents a fixed value in a range delimited by max and min values. This value is visually rendered as a bar, and to know how this bar looks, we compare the value to some other set values:
The low and high values divide the range into the following three parts:
The lower part of the range is between the min and low values, inclusive.
The medium part of the range is between the low and high values, exclusive.
The higher part of the range is between the high and max values, inclusive.
The optimum value defines the optimum value for the <meter> element. In conjunction with the low and high value, it defines which part of the range is preferred:
If the optimum value is in the lower part of the range, the lower range is considered to be the preferred part, the medium range is considered to be the average part, and the higher range is considered to be the worst part.
If the optimum value is in the medium part of the range, the lower range is considered to be an average part, the medium range is considered to be the preferred part, and the higher range is considered to be average as well.
If the optimum value is in the higher part of the range, the lower range is considered to be the worst part, the medium range is considered to be the average part and the higher range is considered to be the preferred part.
All browsers that implement the <meter> element use those values to change the color of the meter bar:
If the current value is in the preferred part of the range, the bar is green.
If the current value is in the average part of the range, the bar is yellow.
If the current value is in the worst part of the range, the bar is red.
Such a bar is created by using the <meter> element. This is for implementing any kind of meter; for example, a bar showing the total space used on a disk, which turns red when it starts to get full.
html
Copy to Clipboard
play
<meter min="0" max="100" value="75" low="33" high="66" optimum="0">75</meter>

play
The content inside the <meter> element is a fallback for browsers that don't support the element and for assistive technologies to vocalize it.
Progress
A progress bar represents a value that changes over time up to a maximum value specified by the max attribute. Such a bar is created using a <progress> element.
html
Copy to Clipboard
play
<progress max="100" value="75">75/100</progress>

play
This is for implementing anything requiring progress reporting, such as the percentage of total files downloaded, or the number of questions filled in on a questionnaire.
The content inside the <progress> element is a fallback for browsers that don't support the element and for screen readers to vocalize it.
Summary
As you'll have seen in the last few articles, there are many types of form controls. You don't need to remember all of these details at once, and can return to these articles as often as you like to check up on details.
Now that you have a grasp of the HTML behind the different available form controls, we'll take a look at Styling them.
Styling web forms
Previous


Overview: Web forms


Next


In the previous few articles, we showed how to create web forms in HTML. Now, we'll show how to style them in CSS.
Prerequisites:
A basic understanding of HTML and CSS Styling basics.
Objective:
To understand the issues behind styling forms, and learn some of the basic styling techniques that will be useful to you.

Challenges in styling form widgets
History
In 1995, the HTML 2 specification introduced form controls (a.k.a. "form widgets", or "form elements"). But CSS wasn't released until late 1996, and wasn't supported by most browsers until years afterward; so, in the interim, browsers relied on the underlying operating system to render form widgets.
Even with CSS available, browser vendors were reluctant at first to make form elements stylable, because users were so accustomed to the looks of their respective browsers. But things have changed, and forms widgets are now mostly stylable, with a few exceptions.
Types of widgets
Easy-to-style
<form>
<fieldset> and <legend>
Single-line text <input>s (e.g., type text, url, email), except for <input type="search">.
Multi-line <textarea>
Buttons (both <input> and <button>)
<label>
<output>
Harder-to-style
Checkboxes and radio buttons
<input type="search">
The article Advanced form styling shows how to style these.
Having internals can't be styled in CSS alone
<input type="color">
Date-related controls such as <input type="datetime-local">
<input type="range">
<input type="file">
Elements involved in creating dropdown widgets, including <select>, <option>, <optgroup> and <datalist>.
Note: Some browsers now support Customizable select elements, a set of HTML and CSS features that together enable full customization of <select> elements and their contents just like any regular DOM elements.
<progress> and <meter>
For example, the date picker calendar, and the button on <select> that displays an options list when clicked, can't be styled using CSS alone.
The articles Advanced form styling and How to build custom form controls describe how to style these.
Note: Some proprietary CSS pseudo-elements, such as ::-moz-range-track, are capable of styling such internal components, but these aren't consistent across browsers, so aren't very reliable. We will mention these later.
Styling simple form widgets
The "easy-to-style" widgets in the previous section may be styled using techniques from the articles Your first form and CSS building blocks. There are also special selectors — UI pseudo-classes — that enable styling based on the current state of the UI.
We'll walk through an example at the end of this article — but first, here are some special aspects of form styling that are worth knowing about.
Fonts and text
CSS font and text features can be used easily with any widget (and yes, you can use @font-face with form widgets). However, browser behavior is often inconsistent. By default, some widgets do not inherit font-family and font-size from their parents. Many browsers use the system's default appearance instead. To make your forms' appearance consistent with the rest of your content, you can add the following rules to your stylesheet:
css
Copy to Clipboard
button,
input,
select,
textarea {
  font-family: inherit;
  font-size: 100%;
}

The inherit property value causes the property value to match the computed value of the property of its parent element; inheriting the value of the parent.
The screenshots below show the difference. On the left is the default rendering of an <input type="text">, <input type="date">, <select>, <textarea>, <input type="submit">, and a <button> in Chrome on macOS, with the platform's default font style in use. On the right are the same elements, with our above style rule applied.

The defaults differed in a number of ways. Inheriting should change their fonts to that of the parent's font family — in this case, the default serif font of the parent container. They all do, with a strange exception — <input type="submit"> does not inherit from the parent paragraph in Chrome. Rather, it uses the font-family: system-ui. This is another reason to use <button> elements over their equivalent input types!
There's a lot of debate as to whether forms look better using the system default styles, or customized styles designed to match your content. This decision is yours to make, as the designer of your site, or web application.
Box sizing
All text fields have complete support for every property related to the CSS box model, such as width, height, padding, margin, and border. As before, however, browsers rely on the system default styles when displaying these widgets. It's up to you to define how you wish to blend them into your content. If you want to keep the native look and feel of the widgets, you'll face a little difficulty if you want to give them a consistent size.
This is because each widget has its own rules for border, padding, and margin. To give the same size to several different widgets, you can use the box-sizing property along with some consistent values for other properties:
css
Copy to Clipboard
input,
textarea,
select,
button {
  width: 150px;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

In the screenshot below, the left column shows the default rendering of an <input type="radio">, <input type="checkbox">, <input type="range">, <input type="text">, <input type="date">, <select>, <textarea>, <input type="submit">, and <button>. The right column on the other hand shows the same elements with our above rule applied to them. Notice how this lets us ensure that all of the elements occupy the same amount of space, despite the platform's default rules for each kind of widget.

What may not be apparent via the screenshot is that the radio and checkbox controls still look the same, but they are centered in the 150px of horizontal space provided by the width property. Other browsers may not center the widgets, but they do adhere to the space allotted.
Legend placement
The <legend> element is okay to style, but it can be a bit tricky to control the placement of it. By default, it is always positioned over the top border of its <fieldset> parent, near the top left corner. To position it somewhere else, for example inside the fieldset somewhere, or near the bottom left corner, you need to rely on the positioning.
Take the following example:
To position the legend in this manner, we used the following CSS (other declarations removed for brevity):
css
Copy to Clipboard
fieldset {
  position: relative;
}

legend {
  position: absolute;
  bottom: 0;
  right: 0;
}

The <fieldset> needs to be positioned too, so that the <legend> is positioned relative to it (otherwise the <legend> would be positioned relative to the <body>).
The <legend> element is very important for accessibility — it will be spoken by assistive technologies as part of the label of each form element inside the fieldset — but using a technique like the one above is fine. The legend contents will still be spoken in the same way; it is just the visual position that has changed.
Note: You could also use the transform property to help you with positioning your <legend>. However, when you position it with for example a transform: translateY();, it moves but leaves an ugly gap in the <fieldset> border, which is not easy to get rid of.
A specific styling example
Let's look at a concrete example of how to style an HTML form. We will build a fancy-looking "postcard" contact form; see here for the finished version.
If you want to follow along with this example, make a local copy of our postcard-start.html file, and follow the below instructions.
The HTML
The HTML is only slightly more involved than the example we used in Your first form; it just has a few extra IDs and a heading.
html
Copy to Clipboard
<form>
  <h1>to: Mozilla</h1>

  <div id="from">
    <label for="name">from:</label>
    <input type="text" id="name" name="user_name" />
  </div>

  <div id="reply">
    <label for="mail">reply:</label>
    <input type="email" id="mail" name="user_email" />
  </div>

  <div id="message">
    <label for="msg">Your message:</label>
    <textarea id="msg" name="user_message"></textarea>
  </div>

  <div class="button">
    <button type="submit">Send your message</button>
  </div>
</form>

Add the above code into the body of your HTML.
Organizing your assets
This is where the fun begins! Before we start coding, we need three additional assets:
The postcard background — download this image and save it in the same directory as your working HTML file.
A typewriter font: The "Mom's Typewriter" font from dafont.com — download the TTF file into the same directory as above.
A hand-drawn font: The "Journal" font from dafont.com — download the TTF file into the same directory as above.
Your fonts need some more processing before you start:
Go to the fontsquirrel.com Webfont Generator.
Using the form, upload both your font files and generate a webfont kit. Download the kit to your computer.
Unzip the provided zip file.
Inside the unzipped contents you will find some font files (at the time of writing, two .woff files and two .woff2 files; they might vary in the future.) Copy these files into a directory called fonts, in the same directory as before. We are using two different files for each font to maximize browser compatibility; see our Web fonts article for a lot more information.
The CSS
Now we can dig into the CSS for the example. Add all the code blocks shown below inside the <style> element, one after another.
Overall layout
First, we prepare by defining our @font-face rules, and all the basic styles set on the <body> and <form> elements. If the fontsquirrel output was different from what we described above, you can find the correct @font-face blocks inside your downloaded webfont kit, in the stylesheet.css file (you'll need to replace the below @font-face blocks with them, and update the paths to the font files):
css
Copy to Clipboard
@font-face {
  font-family: "handwriting";
  src:
    url("fonts/journal-webfont.woff2") format("woff2"),
    url("fonts/journal-webfont.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "typewriter";
  src:
    url("fonts/momot___-webfont.woff2") format("woff2"),
    url("fonts/momot___-webfont.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

body {
  font: 1.3rem sans-serif;
  padding: 0.5em;
  margin: 0;
  background: #222;
}

form {
  position: relative;
  width: 740px;
  height: 498px;
  margin: 0 auto;
  padding: 1em;
  box-sizing: border-box;
  background: #fff url(background.jpg);

  /* we create our grid */
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 10em 1em 1em 1em;
}

Notice that we've used some CSS grid and Flexbox to lay out the form. Using this we can easily position our elements, including the title and all the form elements:
css
Copy to Clipboard
h1 {
  font:
    1em "typewriter",
    monospace;
  align-self: end;
}

#message {
  grid-row: 1 / 5;
}

#from,
#reply {
  display: flex;
}

Labels and controls
Now we can start working on the form elements themselves. First, let's ensure that the <label>s are given the right font:
css
Copy to Clipboard
label {
  font:
    0.8em "typewriter",
    sans-serif;
}

The text fields require some common rules. In other words, we remove their borders and backgrounds, and redefine their padding and margin:
css
Copy to Clipboard
input,
textarea {
  font:
    1.4em/1.5em "handwriting",
    cursive,
    sans-serif;
  border: none;
  padding: 0 10px;
  margin: 0;
  width: 80%;
  background: none;
}

When one of these fields gains focus, we highlight them with a light grey, transparent, background (it is always important to have focus style, for usability and keyboard accessibility):
css
Copy to Clipboard
input:focus,
textarea:focus {
  background: rgb(0 0 0 / 10%);
  border-radius: 5px;
}

Now that our text fields are complete, we need to adjust the display of the single and multiple-line text fields to match, since they won't typically look the same using the defaults.
Tweaking the text areas
<textarea> elements default to being rendered as an inline-block element. The two important things here are the resize and overflow properties. While our design is a fixed-size design, and we could use the resize property to prevent users from resizing our multi-line text field, it is best to not prevent users from resizing a textarea if they so choose. The overflow property is used to make the field render more consistently across browsers. Some browsers default to the value auto, while some default to the value scroll. In our case, it's better to be sure everyone will use auto:
css
Copy to Clipboard
textarea {
  display: block;

  padding: 10px;
  margin: 10px 0 0 -10px;
  width: 100%;
  height: 90%;

  border-right: 1px solid;

  /* resize  : none; */
  overflow: auto;
}

Styling the submit button
The <button> element is really convenient to style with CSS; you can do whatever you want, even using pseudo-elements:
css
Copy to Clipboard
button {
  padding: 5px;
  font: bold 0.6em sans-serif;
  border: 2px solid #333;
  border-radius: 5px;
  background: none;
  cursor: pointer;
  transform: rotate(-1.5deg);
}

button::after {
  content: " >>>";
}

button:hover,
button:focus {
  background: #000;
  color: #fff;
}

The final result
And voilà! Your form should now look like this:

Note: If your example does not work quite as you expected and you want to check it against our version, you can find it on GitHub — see it running live (also see the source code).
Summary
As you can see, as long as we want to build forms with just text fields and buttons, it's easy to style them using CSS. In the next article, we will see how to handle form widgets which fall into the "bad" and "ugly" categories.





Advanced form styling
Previous


Overview: Web forms


Next


In this article, we will see what can be done with CSS to style the types of form control that are more difficult to style — the "bad" and "ugly" categories. As we saw in the previous article, text fields and buttons are perfectly easy to style; now we will dig into styling the more problematic bits.
Prerequisites:
A basic understanding of HTML and CSS.
Objective:
To understand what parts of forms are hard to style, and why; to learn what can be done to customize them.


To recap what we said in the previous article, we have:
The bad: Some elements are more difficult to style, requiring more complex CSS or some more specific tricks:
Checkboxes and radio buttons
<input type="search">
The ugly: Some elements can't be styled thoroughly using CSS. These include:
Elements involved in creating dropdown widgets, including <select>, <option>, <optgroup> and <datalist>.
Note: Some browsers now support Customizable select elements, a set of HTML and CSS features that together enable full customization of <select> elements and their contents just like any regular DOM elements.
<input type="color">
Date-related controls such as <input type="datetime-local">
<input type="range">
<input type="file">
<progress> and <meter>
Let's first talk about the appearance property, which is useful for making all of the above more stylable.
appearance: controlling OS-level styling
In the previous article, we mentioned that historically, the styling of web form controls was largely derived from the underlying operating system, which is part of the reason for the difficulty in customizing the look of these controls.
The appearance property was created as a way to control what OS- or system-level styling was applied to web form controls. By far the most helpful value, and probably the only one you'll use, is none. This stops any control you apply it to from using system-level styling, as much as possible, and lets you build up the styles yourself using CSS.
For example, let's take the following controls:
html
Copy to Clipboard
<form>
  <p>
    <label for="search">search: </label>
    <input id="search" name="search" type="search" />
  </p>
  <p>
    <label for="text">text: </label>
    <input id="text" name="text" type="text" />
  </p>
  <p>
    <label for="date">date: </label>
    <input id="date" name="date" type="datetime-local" />
  </p>
  <p>
    <label for="radio">radio: </label>
    <input id="radio" name="radio" type="radio" />
  </p>
  <p>
    <label for="checkbox">checkbox: </label>
    <input id="checkbox" name="checkbox" type="checkbox" />
  </p>
  <p><input type="submit" value="submit" /></p>
  <p><input type="button" value="button" /></p>
</form>
Applying the following CSS to them removes system-level styling.
css
Copy to Clipboard
input {
  appearance: none;
}
The following live example shows you what they look like in your system — default on the left, and with the above CSS applied on the right (find it here also if you want to test it on other systems).
In most cases, the effect is to remove the stylized border, which makes CSS styling a bit easier, but isn't essential. In a couple of cases, such as radio buttons and checkboxes, it becomes way more useful. We'll look at those now.
Search boxes and appearance
The appearance: none; value used to be particularly useful for consistently styling <input type="search"> elements. Without it, Safari didn't allow height or font-size values to be set on them. However, this is no longer the case in Safari 16 and later. You may still want to target input[type="search"] explicitly with appearance: none; if your browser support matrix includes Safari versions older than 16.
In search inputs, the "x" delete button, which appears when the value is not null, disappears when the input loses focus in Edge and Chrome, but stays put in Safari. To remove via CSS, you can use this following rule:
css
Copy to Clipboard
input[type="search"]:not(:focus, :active)::-webkit-search-cancel-button {
  display: none;
}
Styling checkboxes and radio buttons
Styling a checkbox or a radio button is tricky by default. The sizes of checkboxes and radio buttons are not meant to be changed with their default designs, and browsers react very differently when you try.
For example, consider this simple test case:
html
Copy to Clipboard
<label
  ><span><input type="checkbox" name="q5" value="true" /></span> True</label
>
<label
  ><span><input type="checkbox" name="q5" value="false" /></span> False</label
>


css
Copy to Clipboard
span {
  display: inline-block;
  background: red;
}

input[type="checkbox"] {
  width: 100px;
  height: 100px;
}
Different browsers handle the checkbox and span differently, often ugly ways:
Browser
Rendering
Firefox 71 (macOS)

Firefox 57 (Windows 10)

Chrome 77 (macOS), Safari 13, Opera

Chrome 63 (Windows 10)

Edge 16 (Windows 10)



Using appearance: none on radios/checkboxes
As we showed before, you can remove the default appearance of a checkbox or radio button altogether with appearance: none;. Let's take this example HTML:
html
Copy to Clipboard
<form>
  <fieldset>
    <legend>Fruit preferences</legend>

    <p>
      <label>
        <input type="checkbox" name="fruit" value="cherry" />
        I like cherry
      </label>
    </p>
    <p>
      <label>
        <input type="checkbox" name="fruit" value="banana" disabled />
        I can't like banana
      </label>
    </p>
    <p>
      <label>
        <input type="checkbox" name="fruit" value="strawberry" />
        I like strawberry
      </label>
    </p>
  </fieldset>
</form>
Now, let's style these with a custom checkbox design. Let's start by unstyling the original check boxes:
css
Copy to Clipboard
input[type="checkbox"] {
  appearance: none;
}
We can use the :checked and :disabled pseudo-classes to change the appearance of our custom checkbox as its state changes:
css
Copy to Clipboard
input[type="checkbox"] {
  position: relative;
  width: 1em;
  height: 1em;
  border: 1px solid gray;
  /* Adjusts the position of the checkboxes on the text baseline */
  vertical-align: -2px;
  /* Set here so that Windows' High-Contrast Mode can override */
  color: green;
}

input[type="checkbox"]::before {
  content: "✔";
  position: absolute;
  font-size: 1.2em;
  right: -1px;
  top: -0.3em;
  visibility: hidden;
}

input[type="checkbox"]:checked::before {
  /* Use `visibility` instead of `display` to avoid recalculating layout */
  visibility: visible;
}

input[type="checkbox"]:disabled {
  border-color: black;
  background: #ddd;
  color: gray;
}
You'll find out more about such pseudo-classes and more in the next article; the above ones do the following:
:checked — the checkbox (or radio button) is in a checked state — the user has clicked/activated it.
:disabled — the checkbox (or radio button) is in a disabled state — it cannot be interacted with.
You can see the live result:
We've also created a couple of other examples to give you more ideas:
Styled radio buttons: Custom radio button styling.
Toggle switch example: A checkbox styled to look like a toggle switch.
If you view these checkboxes in a browser that doesn't support appearance, your custom design will be lost, but they will still look like checkboxes and be usable.
What can be done about the "ugly" elements?
Now let's turn our attention to the "ugly" controls — the ones that are really hard to thoroughly style. In short, these are drop-down boxes, complex control types like color and datetime-local, and feedback—oriented controls like <progress> and <meter>.
The problem is that these elements have very different default looks across browsers, and while you can style them in some ways, some parts of their internals are impossible to style.
If you are prepared to live with some differences in look and feel, you can use some simple styling to improve things significantly. This includes consistent sizing and styling of properties like background-color, and usage of appearance to remove some system-level styling.
Take the following example, which shows a number of the "ugly" form features in action:
This example has the following CSS applied to it:
css
Copy to Clipboard
body {
  font-family: "Josefin Sans", sans-serif;
  margin: 20px auto;
  max-width: 400px;
}

form > div {
  margin-bottom: 20px;
}

select {
  appearance: none;
  width: 100%;
  height: 100%;
}

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: "▼";
  font-size: 1rem;
  top: 3px;
  right: 10px;
  position: absolute;
}

button,
label,
input,
select,
progress,
meter {
  display: block;
  font-family: inherit;
  font-size: 100%;
  margin: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 5px;
  height: 30px;
}

input[type="text"],
input[type="datetime-local"],
input[type="color"],
select {
  box-shadow: inset 1px 1px 3px #ccc;
  border-radius: 5px;
}

label {
  margin-bottom: 5px;
}

button {
  width: 60%;
  margin: 0 auto;
}
Note: If you want to test these examples across several browsers simultaneously, you can find it live here (also see here for the source code).
Also bear in mind that we've added some JavaScript to the page that lists the files selected by the file picker, below the control itself. This is a simplified version of the example found on the <input type="file"> reference page.
As you can see, we've done fairly well at getting these to look uniform across modern browsers.
We've applied some global normalizing CSS to all the controls and their labels, to get them to size in the same way, adopt their parent font, etc., as mentioned in the previous article:
css
Copy to Clipboard
button,
label,
input,
select,
progress,
meter {
  display: block;
  font-family: inherit;
  font-size: 100%;
  margin: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 5px;
  height: 30px;
}
We also added some uniform shadow and rounded corners to the controls where it makes sense:
css
Copy to Clipboard
input[type="text"],
input[type="datetime-local"],
input[type="color"],
select {
  box-shadow: inset 1px 1px 3px #ccc;
  border-radius: 5px;
}
On other controls like range types, progress bars, and meters, they just add an ugly box around the control area, so it doesn't make sense.
Let's talk about some specifics of each of these types of control, highlighting difficulties along the way.
Selects and datalists
Some browsers now support Customizable select elements, a set of HTML and CSS features that together enable full customization of <select> elements and their contents just like any regular DOM elements. In supporting browsers and codebases, you no longer need to worry about the legacy techniques described below for <select> elements.
Styling datalists and selects (in browsers that don't support customizable selects) allows an acceptable level of customization, provided you don't want to vary the look and feel too much from the defaults. We've managed to get the boxes looking pretty uniform and consistent. The datalist-invoking control is an <input type="text"> anyway, so we knew this wouldn't be a problem.
Two things are slightly more problematic. First of all, the select's "arrow" icon that indicates it is a dropdown differs across browsers. It also tends to change if you increase the size of the select box or resize it in an ugly fashion. To fix this in our example, we first used our old friend appearance: none to get rid of the icon altogether:
css
Copy to Clipboard
select {
  appearance: none;
}
We then created our own icon using generated content. We put an extra wrapper around the control, because ::before/::after don't work on <select> elements (their content is fully controlled by the browser):
html
Copy to Clipboard
<label for="select">Select a fruit</label>
<div class="select-wrapper">
  <select id="select" name="select">
    <option>Banana</option>
    <option>Cherry</option>
    <option>Lemon</option>
  </select>
</div>
We then use generated content to generate a little down arrow, and put it in the right place using positioning:
css
Copy to Clipboard
.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: "▼";
  font-size: 1rem;
  top: 6px;
  right: 10px;
  position: absolute;
}
The second, slightly more important issue is that you don't have control over the box that appears containing the options when you click on the <select> box to open it. You can inherit the font set on the parent, but you won't be able to set things like spacing and colors. The same is true for the autocomplete list that appears with <datalist>.
If you really need full control over the option styling, you'll have to either use a library to generate a custom control or build your own. In the case of <select>, you could also use the multiple attribute, which makes all the options appear on the page, sidestepping this particular problem:
html
Copy to Clipboard
<label for="select">Select fruits</label>
<select id="select" name="select" multiple>
  …
</select>
Of course, this might also not fit in with the design you are going for, but it's worth noting!
Date input types
The date/time input types (datetime-local, time, week, month) all have the same major associated issue. The actual containing box is as easy to style as any text input, and what we've got in this demo looks fine.
However, the internal parts of the control (e.g., the popup calendar that you use to pick a date, the spinner that you can use to increment/decrement values) are not stylable at all, and you can't get rid of them using appearance: none;. If you really need full control over the styling, you'll have to either use a library to generate a custom control or build your own.
Note: It is worth mentioning <input type="number"> here too — this also has a spinner that you can use to increment/decrement values, so potentially suffers from the same problem. However, in the case of the number type the data being collected is simpler, and it is easy to just use a tel input type instead, which has the appearance of text, but displays the numeric keypad in devices with touch keyboards.
Range input types
<input type="range"> is annoying to style. You can use something like the following to remove the default slider track completely and replace it with a custom style (a thin red track, in this case):
css
Copy to Clipboard
input[type="range"] {
  appearance: none;
  background: red;
  height: 2px;
  padding: 0;
  outline: 1px solid transparent;
}
However, it is very difficult to customize the style of the range control's drag handle — to get full control over range styling, you'll need to use some complex CSS code, including multiple non-standard, browser-specific pseudo-elements. Check out Styling Cross-Browser Compatible Range Inputs with CSS on CSS tricks for a detailed write-up of what's needed.
Color input types
Input controls of type color are not too bad. In supporting browsers, they tend to give you a block of solid color with a small border.
You can remove the border, just leaving the block of color, using something like this:
css
Copy to Clipboard
input[type="color"] {
  border: 0;
  padding: 0;
}
However, a custom solution is the only way to get anything significantly different.
File input types
Inputs of type file are generally OK — as you saw in our example, it is fairly easy to create something that fits in OK with the rest of the page — the output line that is part of the control will inherit the parent font if you tell the input to do so, and you can style the custom list of file names and sizes in any way you want; we created it after all.
The only problem with file pickers is that the button you press to open the file picker is completely unstylable — it can't be sized or colored, and it won't even accept a different font.
One way around this is to take advantage of the fact that if you have a label associated with a form control, clicking the label will activate the control. So you could hide the actual form input using something like this:
css
Copy to Clipboard
input[type="file"] {
  height: 0;
  padding: 0;
  opacity: 0;
}
And then style the label to act like a button, which, when pressed, will open the file picker as expected:
css
Copy to Clipboard
label[for="file"] {
  box-shadow: 1px 1px 3px #ccc;
  background: linear-gradient(to bottom, #eee, #ccc);
  border: 1px solid rgb(169 169 169);
  border-radius: 5px;
  text-align: center;
  line-height: 1.5;
}

label[for="file"]:hover {
  background: linear-gradient(to bottom, #fff, #ddd);
}

label[for="file"]:active {
  box-shadow: inset 1px 1px 3px #ccc;
}
You can see the result of the above CSS styling in the live example below (see also styled-file-picker.html live, and the source code).
Meters and progress bars
<meter> and <progress> are possibly the worst of the lot. As you saw in the earlier example, we can set them to the desired width relatively accurately. But beyond that, they are really difficult to style in any way. They don't handle height settings consistently between each other and between browsers, you can color the background but not the foreground bar, and setting appearance: none on them makes things worse, not better.
It is easier to create your own custom solution for these features if you want to control the styling, or use a third-party solution such as progressbar.js.
Summary
While there are still difficulties using CSS with HTML forms, there are ways to get around many of the problems. There are no clean, universal solutions, but modern browsers offer new possibilities. For now, the best solution is to learn more about the way the different browsers support CSS when applied to HTML form controls.
In the next article of this module, we will explore creating fully-customized <select> elements using the dedicated, modern HTML and CSS features available for this purpose.
Previous


Overview: Web forms




Customizable select elements
Previous


Overview: Web forms


Next


This article explains how to create fully-customized <select> elements using experimental browser features. This includes having full control over styling the select button, drop-down picker, arrow icon, current selection checkmark, and each individual <option> element.
Warning: The CSS and HTML features demonstrated in this article currently have limited browser support; check the browser compatibility tables on the individual feature reference pages for more details. Some JavaScript frameworks block these features; in others, they cause hydration failures when Server-Side Rendering (SSR) is enabled.
Background
Traditionally it has been difficult to customize the look and feel of <select> elements because they contain internals that are styled at the operating system level, which can't be targeted using CSS. This includes the drop-down picker, arrow icon, and so on.
Previously, the best available option — aside from using a custom JavaScript library — was to set an appearance value of none on the <select> element to strip away some of the OS-level styling, and then use CSS to customize the bits that can be styled. This technique is explained in Advanced form styling.
Customizable <select> elements provide a solution to these issues. They allow you to build examples like the following, using only HTML and CSS, which are fully customized in supporting browsers. This includes <select> and drop-down picker layout, color scheme, icons, font, transitions, positioning, markers to indicate the selected icon, and more.
play
In addition, they provide a progressive enhancement on top of existing functionality, falling back to "classic" selects in non-supporting browsers.
You'll find out how to build this example in the sections below.
What features comprise a customizable select?
You can build customizable <select> elements using the following HTML and CSS features:
Plain old <select>, <option>, and <optgroup> elements. These work just the same as in "classic" selects, except that they have additional permitted content types.
A <button> element included as the first child inside the <select> element, which wasn't previously allowed in "classic" selects. When this is included, it replaces the default "button" rendering of the closed <select> element. This is commonly known as the select button (as it is the button you need to press to open the drop-down picker).
Note: The select button is inert by default so that if interactive children (for example, links or buttons) are included inside it, it will still be treated like a single button for interaction purposes — for example, the child items won't be focusable or clickable.
The <selectedcontent> element can optionally be included inside the <select> element's first child <button> element in order to display the currently selected value inside the closed <select> element. This contains a clone of the currently-selected <option> element's content (created using cloneNode() under the hood).
The ::picker(select) pseudo-element, which targets the entire contents of the picker. This includes all elements inside the <select> element, except the first child <button>.
The appearance property value base-select, which opts the <select> element and the ::picker(select) pseudo-element into the browser-defined default styles and behavior for customizable select.
The :open pseudo-class, which targets the select button when the picker (::picker(select)) is open.
The ::picker-icon pseudo-element, which targets the icon inside the select button — the arrow that points down when the select is closed.
The :checked pseudo-class, which targets the currently-selected <option> element.
The ::checkmark pseudo-element, which targets the checkmark placed inside the currently-selected <option> element to provide a visual indication of which one is selected.
In addition, the <select> element and its drop-down picker have the following behavior assigned to them automatically:
They have an invoker/popover relationship, as specified by the Popover API, which provides the ability to select the picker when open via the :popover-open pseudo-class. See Using the Popover API for more details of popover behavior.
They have an implicit anchor reference, meaning that the picker is automatically associated with the <select> element via CSS anchor positioning. The browser default styles position the picker relative to the button (the anchor) and you can customize this position as explained in Positioning elements relative to their anchor. The browser default styles also define some position-try fallbacks that reposition the picker if it is in danger of overflowing the viewport. Position try fallback are explained in Handling overflow: try fallbacks and conditional hiding.
Note: You can check browser support for customizable <select> by viewing the browser compatibility tables on the reference pages for related features such as <selectedcontent>, ::picker(select), and ::checkmark.
Let's look at all of the above features in action, by walking through the example shown at the top of the page.
Customizable select markup
Our example is a typical <select> menu that allows you to choose a pet. The markup is as follows:
html
Copy to Clipboard
play
<form>
  <p>
    <label for="pet-select">Select pet:</label>
    <select id="pet-select">
      <button>
        <selectedcontent></selectedcontent>
      </button>

      <option value="">Please select a pet</option>
      <option value="cat">
        <span class="icon" aria-hidden="true">🐱</span
        ><span class="option-label">Cat</span>
      </option>
      <option value="dog">
        <span class="icon" aria-hidden="true">🐶</span
        ><span class="option-label">Dog</span>
      </option>
      <option value="hamster">
        <span class="icon" aria-hidden="true">🐹</span
        ><span class="option-label">Hamster</span>
      </option>
      <option value="chicken">
        <span class="icon" aria-hidden="true">🐔</span
        ><span class="option-label">Chicken</span>
      </option>
      <option value="fish">
        <span class="icon" aria-hidden="true">🐟</span
        ><span class="option-label">Fish</span>
      </option>
      <option value="snake">
        <span class="icon" aria-hidden="true">🐍</span
        ><span class="option-label">Snake</span>
      </option>
    </select>
  </p>
</form>
Note: The aria-hidden="true" attribute is included on the icons so that they will be hidden from assistive technologies, avoiding the option values being announced twice (for example, "cat cat").
The example markup is nearly the same as "classic" <select> markup, with the following differences:
The <button><selectedcontent></selectedcontent></button> structure represents the select <button>. Adding the <selectedcontent> element causes the browser to clone the currently-selected <option> inside the button, which you can then provide custom styles for. If this structure is not included in your markup, the browser will fall back to rendering the selected option's text inside the default button, and you won't be able to style it as easily.
Note: You can include arbitrary content inside the <button> to render whatever you want inside the closed <select>, but be careful when doing this. What you include can alter the accessible value exposed to assistive technology for the <select> element.
The rest of the <select> contents represents the drop-down picker, which is usually limited to the <option> elements representing the different choices in the picker. You can include other content in the picker, but it is not recommended.
Traditionally, <option> elements could only contain text, but in a customizable select you can include other markup structures like images, other non-interactive text-level semantic elements, and more. You can even use the ::before and ::after pseudo-elements to include other content, although bear in mind that this wouldn't be included in the submittable value. In our example, each <option> contains two <span> elements containing an icon and a text label respectively, allowing each one to be styled and positioned independently.
Note: Because the <option> content can contain multi-level DOM sub-trees, not just text nodes, there are rules concerning how the browser should extract the current <select> value via JavaScript. The selected <option> element's textContent property value is retrieved, trim() is run on it, and the result is set as the <select> value.
This design allows non-supporting browsers to fall back to a classic <select> experience. The <button><selectedcontent></selectedcontent></button> structure will be ignored completely, and the non-text <option> contents will be stripped out to just leave the text node contents, but the result will still function.
Opting in to the custom select rendering
To opt-in to the custom select functionality and minimal browser base styles (and remove the OS-provided styling), your <select> element and its drop-down picker (represented by the ::picker(select) pseudo-element) both need to have an appearance value of base-select set on them:
css
Copy to Clipboard
play
select,
::picker(select) {
  appearance: base-select;
}
You can choose to opt-in just the <select> element to the new functionality, leaving the picker with the default OS styling, but in most cases, you'll want to opt-in both. You can't opt-in the picker without opting in the <select> element.
Once this is done, the result is a very plain rendering of a <select> element:
play
You are now free to style this in any way you want. To begin with, the <select> element has custom border, background (which changes on :hover or :focus), and padding values set, plus a transition so that the background change animates smoothly:
css
Copy to Clipboard
play
select {
  border: 2px solid #ddd;
  background: #eee;
  padding: 10px;
  transition: 0.4s;
}

select:hover,
select:focus {
  background: #ddd;
}
Styling the picker icon
To style the icon inside the select button — the arrow that points down when the select is closed — you can target it with the ::picker-icon pseudo-element. The following code gives the icon a custom color and a transition so that changes to its rotate property are smoothly animated:
css
Copy to Clipboard
play
select::picker-icon {
  color: #999;
  transition: 0.4s rotate;
}
Next up, ::picker-icon is combined with the :open pseudo-class — which targets the select button only when the drop-down picker is open — to give the icon a rotate value of 180deg when the <select> is opened.
css
Copy to Clipboard
play
select:open::picker-icon {
  rotate: 180deg;
}
Let's have a look at the work so far — note how the picker arrow rotates smoothly through 180 degrees when the <select> opens and closes:
play
Styling the drop-down picker
The drop-down picker can be targeted using the ::picker(select) pseudo-element. As mentioned earlier, the picker contains everything inside the <select> element that isn't the button and the <selectedcontent>. In our example, this means all the <option> elements and their contents.
First of all, the picker's default black border is removed:
css
Copy to Clipboard
play
::picker(select) {
  border: none;
}
Now the <option> elements are styled. They are laid out with flexbox, aligning them all to the start of the flex container and including a 20px gap between each one. Each <option> is also given the same border, background, padding, and transition as the <select>, to provide a consistent look and feel:
css
Copy to Clipboard
play
option {
  display: flex;
  justify-content: flex-start;
  gap: 20px;

  border: 2px solid #ddd;
  background: #eee;
  padding: 10px;
  transition: 0.4s;
}
Note: Customizable <select> element <option>s have display: flex set on them by default, but it is included in our stylesheet anyway to clarify what is going on.
Next, a combination of the :first-of-type, :last-of-type, and :not() pseudo-classes is used to set an appropriate border-radius on the top and bottom corners of the picker, and remove the border-bottom from all <option> elements except the last one so the borders don't look messy and doubled-up:
css
Copy to Clipboard
play
option:first-of-type {
  border-radius: 8px 8px 0 0;
}

option:last-of-type {
  border-radius: 0 0 8px 8px;
}

option:not(option:last-of-type) {
  border-bottom: none;
}
Next a different background color is set on the odd-numbered <option> elements using :nth-of-type(odd) to implement zebra-striping, and a different background color is set on the <option> elements on focus and hover, to provide a useful visual highlight during selection:
css
Copy to Clipboard
play
option:nth-of-type(odd) {
  background: #fff;
}

option:hover,
option:focus {
  background: plum;
}
Finally for this section, a larger font-size is set on the <option> icons (contained within <span> elements with a class of icon) to make them bigger, and the text-box property is used to remove some of the annoying spacing at the block-start and block-end edges of the icon emojis, making them align better with the text labels:
css
Copy to Clipboard
play
option .icon {
  font-size: 1.6rem;
  text-box: trim-both cap alphabetic;
}
Our example now renders like this:
play
Adjusting the styling of the selected option contents inside the select button
If you select any pet option from the last few live examples, you'll notice a problem — the pet icons cause the select button to increase in height, which also changes the position of the picker icon, and there is no spacing between the option icon and label.
This can be fixed by hiding the icon when it is contained inside <selectedcontent>, which represents the contents of the selected <option> as they appear inside the select button. In our example, it is hidden using display: none:
css
Copy to Clipboard
play
selectedcontent .icon {
  display: none;
}
This does not affect the styling of the <option> contents as they appear inside the drop-down picker.
Styling the currently selected option
To style the currently selected <option> as it appears inside the drop-down picker, you can target it using the :checked pseudo-class. This is used to set the selected <option> element's font-weight to bold:
css
Copy to Clipboard
play
option:checked {
  font-weight: bold;
}
Styling the current selection checkmark
You've probably noticed that when you open the picker to make a selection, the currently selected <option> has a checkmark at its inline-start end. This checkmark can be targeted using the ::checkmark pseudo-element. For example, you might want to hide this checkmark (for example, via display: none).
You could also choose to do something a bit more interesting with it — earlier on the <option> elements were laid out horizontally using flexbox, with the flex items being aligned to the start of the row. In the below rule, the checkmark is moved from the start of the row to the end by setting an order value on it greater than 0, and aligning it to the end of the row using an auto margin-left value (see Alignment and auto margins).
Finally, the value of the content property is set to a different emoji, to set a different icon to display.
css
Copy to Clipboard
play
option::checkmark {
  order: 1;
  margin-left: auto;
  content: "☑️";
}
Note: The ::checkmark and ::picker-icon pseudo-elements are not included in the accessibility tree, so any generated content set on them will not be announced by assistive technologies. You should still make sure that any new icon you set visually makes sense for its intended purpose.
Let's check in again on how the example is rendering. The updated state after the last three sections is as follows:
play
Animating the picker using popover states
The customizable <select> element's select button and drop-down picker are automatically given an invoker/popover relationship, as described in Using the Popover API. There are many advantages that this brings to <select> elements; our example takes advantage of the ability to animate between popover hidden and showing states using transitions. The :popover-open pseudo-class represents popovers in the showing state.
The technique is covered quickly in this section — read Animating popovers for a more detailed description.
First of all, the picker is selected using ::picker(select), and given an opacity value of 0 and a transition value of all 0.4s allow-discrete. This causes all properties that change value when the popover state changes from hidden to showing to animate.
css
Copy to Clipboard
play
::picker(select) {
  opacity: 0;
  transition: all 0.4s allow-discrete;
}
The list of transitioned properties features opacity, however it also includes two discrete properties whose values are set by the browser default styles:
display
The display values changes from none to block when the popover changes state from hidden to shown. This needs to be animated to ensure that other transitions are visible.
overlay
The overlay value changes from none to auto when the popover changes state from hidden to shown, to promote it to the top layer, then back again when it is hidden to remove it. This needs to be animated to ensure the removal of the popover from the top layer is deferred until the transition completes, ensuring the transition is visible.
Note: The allow-discrete value is needed to enable discrete property animations.
Next, the picker is selected in the showing state using ::picker(select):popover-open and given an opacity value to 1 — this is the end state of the transition:
css
Copy to Clipboard
play
::picker(select):popover-open {
  opacity: 1;
}
Finally, because the picker is being transitioned while it is moving from display: none to a display value that makes it visible, the transition's starting state has to be specified inside a @starting-style block:
css
Copy to Clipboard
play
@starting-style {
  ::picker(select):popover-open {
    opacity: 0;
  }
}
These rules work together to make the picker smoothly fade in and fade out when the <select> is opened and closed.
Positioning the picker using anchor positioning
A customizable <select> element's select button and drop-down picker have an implicit anchor reference, and the picker is automatically associated with the select button via CSS anchor positioning. This means that an explicit association does not need to be made using the anchor-name and position-anchor properties.
In addition, the browser's default styles provide a default position, which you can customize as explained in Positioning elements relative to their anchor.
In our demo, the position of the picker is set relative to its anchor by using the anchor() function inside its top and left property values:
css
Copy to Clipboard
play
::picker(select) {
  top: calc(anchor(bottom) + 1px);
  left: anchor(10%);
}
This results in the top edge of the picker always being positioned 1 pixel down from the bottom edge of the select button, and the left edge of the picker always being positioned 10% of the select button's width across from its left edge.
Final result
After the last two sections, the final updated state of our <select> is rendered like this:
play
Customizing other classic select features
The above sections have covered all the new functionality available in customizable selects, and shown how it interacts with both classic single-line selects, and related modern features such as popovers and anchor positioning. There are some other <select> element features not mentioned above; this section talks about how they currently work alongside customizable selects:
<select multiple>
There isn't currently any support specified for the multiple attribute on customizable <select> elements, but this will be worked on in the future.
<optgroup>
The default styling of <optgroup> elements is the same as in classic <select> elements — bolded and indented less than the contained options. You need to make sure to style the <optgroup> elements so they fit into the overall design, and bear in mind that they will behave just as containers are expected to behave in conventional HTML. In customizable <select> elements, the <legend> element is allowed as a child of <optgroup>, to provide a label that is easy to target and style. This replaces any text set in the <optgroup> element's label attribute, and it has the same semantics.
Next up
In the next article of this module, we will explore the different UI pseudo-classes available to us in modern browsers for styling forms in different states.
See also
<select>, <option>, <optgroup>, <label>, <button>, <selectedcontent>
appearance
::picker(select), ::picker-icon, ::checkmark
:open, :checked
Previous


UI pseudo-classes
Previous


Overview: Web forms


Next


In the previous articles, we covered the styling of various form controls in a general manner. This included some usage of pseudo-classes, for example, using :checked to target a checkbox only when it is selected. In this article, we explore the different UI pseudo-classes available for styling forms in different states.
Prerequisites:
A basic understanding of HTML and CSS, including general knowledge of pseudo-classes and pseudo-elements.
Objective:
To understand what parts of forms are hard to style, and why; to learn what can be done to customize them.

What pseudo-classes do we have available?
You may already be familiar with the following pseudo-classes:
:hover: Selects an element only when it is being hovered over by a mouse pointer.
:focus: Selects an element only when it is focused (i.e., by being tabbed to via the keyboard).
:active: selects an element only when it is being activated (i.e., while it is being clicked on, or when the Return / Enter key is being pressed down in the case of a keyboard activation).
CSS selectors provide several other pseudo-classes related to HTML forms. These provide several useful targeting conditions that you can take advantage of. We'll discuss these in more detail in the sections below, but briefly, the main ones we'll be looking at are:
:required and :optional: Target elements that can be required (e.g., elements that support the required HTML attribute)), based on whether they are required or optional.
:valid and :invalid, and :in-range and :out-of-range: Target form controls that are valid/invalid according to form validation constraints set on them, or in-range/out-of-range.
:enabled and :disabled, and :read-only and :read-write: Target elements that can be disabled (e.g., elements that support the disabled HTML attribute), based on whether they are currently enabled or disabled, and read-write or read-only form controls (e.g., elements with the readonly HTML attribute set).
:checked, :indeterminate, and :default: Respectively target checkboxes and radio buttons that are checked, in an indeterminate state (neither checked or not checked), and the default selected option when the page loads (e.g., an <input type="checkbox"> with the checked attribute set, or an <option> element with the selected attribute set).
There are many others, but the ones listed above are the most obviously useful. Some of them are aimed at solving very specific niche problems. The UI pseudo-classes listed above have excellent browser support, but of course, you should test your form implementations carefully to ensure they work for your target audience.
Note: A number of the pseudo-classes discussed here are concerned with styling form controls based on their validation state (is their data valid, or not?) You'll learn much more about setting and controlling validation constraints in our next article — Client-side form validation — but for now we'll keep things simple regarding the form validation, so it doesn't confuse things.
Styling inputs based on whether they are required or not
One of the most basic concepts regarding client-side form validation is whether a form input is required (it has to be filled in before the form can be submitted) or optional.
<input>, <select>, and <textarea> elements have a required attribute available which, when set, means that you have to fill in that control before the form will successfully submit. For example, the first name and last name are required in the form below, but the email address is optional:
html
Copy to Clipboard
play
<form>
  <fieldset>
    <legend>Feedback form</legend>
    <div>
      <label for="fname">First name: </label>
      <input id="fname" name="fname" type="text" required />
    </div>
    <div>
      <label for="lname">Last name: </label>
      <input id="lname" name="lname" type="text" required />
    </div>
    <div>
      <label for="email"> Email address (if you want a response): </label>
      <input id="email" name="email" type="email" />
    </div>
    <div><button>Submit</button></div>
  </fieldset>
</form>

You can match these two states using the :required and :optional pseudo-classes. For example, if we apply the following CSS to the above HTML:
css
Copy to Clipboard
play
input:required {
  border: 2px solid;
}


input:optional {
  border: 2px dashed;
}

The required controls have a solid border, and the optional control has a dashed border. You can also try submitting the form without filling it in, to see the client-side validation error messages browsers give you by default:
play
In general, you should avoid styling 'required' versus 'optional' elements in forms using color alone, because this isn't great for colorblind people:
css
Copy to Clipboard
input:required {
  border: 2px solid red;
}


input:optional {
  border: 2px solid green;
}

The standard convention on the web for required status is an asterisk (*), or the word "required" associated with the respective controls. In the next section, we'll look at a better example of indicating required fields using :required and generated content.
Note: You'll probably not find yourself using the :optional pseudo-class very often. Form controls are optional by default, so you could just do your optional styling by default, and add styles on top for required controls.
Note: If one radio button in a same-named group of radio buttons has the required attribute set, all the radio buttons will be invalid until one is selected, but only the one with the attribute assigned will actually match :required.
Using generated content with pseudo-classes
In previous articles, we've seen the usage of generated content, but we thought now would be a good time to talk about it in a bit more detail.
The idea is that we can use the ::before and ::after pseudo-elements along with the content property to make a chunk of content appear before or after the affected element. The chunk of content is not added to the DOM, so it may be invisible to some screen readers. Because it is a pseudo-element, it can be targeted with styles in the same way that any actual DOM node can.
This is really useful when you want to add a visual indicator to an element, such as a label or icon, when alternative indicators are also available to ensure accessibility for all users. For example, in our custom radio buttons example, we use generated content to handle the placement and animation of the custom radio button's inner circle when a radio button is selected:
css
Copy to Clipboard
input[type="radio"]::before {
  display: block;
  content: " ";
  width: 10px;
  height: 10px;
  border-radius: 6px;
  background-color: red;
  font-size: 1.2em;
  transform: translate(3px, 3px) scale(0);
  transform-origin: center;
  transition: all 0.3s ease-in;
}


input[type="radio"]:checked::before {
  transform: translate(3px, 3px) scale(1);
  transition: all 0.3s cubic-bezier(0.25, 0.25, 0.56, 2);
}

This is really useful — screen readers already let their users know when a radio button or checkbox they encounter is checked/selected, so you don't want them to read out another DOM element that indicates selection — that could be confusing. Having a purely visual indicator solves this problem.
Not all <input> types support having generated content put on them. All input types that show dynamic text in them, such as text, password, or button, don't display generated content. Others, including range, color, checkbox, etc., display generated content.
Back to our required/optional example from before, this time we'll not alter the appearance of the input itself — we'll use generated content to add an indicating label (see it live here, and see the source code here).
First of all, we'll add a paragraph to the top of the form to say what you are looking for:
html
Copy to Clipboard
<p>Required fields are labeled with "required".</p>

Screen reader users will get "required" read out as an extra bit of information when they get to each required input, while sighted users will get our label.
As previously mentioned, text inputs don't support generated content, so we add an empty <span> to hang the generated content on:
html
Copy to Clipboard
<div>
  <label for="fname">First name: </label>
  <input id="fname" name="fname" type="text" required />
  <span></span>
</div>

The immediate problem with this was that the span was dropping onto a new line below the input because the input and label are both set with width: 100%. To fix this we style the parent <div> to become a flex container, but also tell it to wrap its contents onto new lines if the content becomes too long:
css
Copy to Clipboard
fieldset > div {
  margin-bottom: 20px;
  display: flex;
  flex-flow: row wrap;
}

The effect this has is that the label and input sit on separate lines because they are both width: 100%, but the <span> has a width of 0 so it can sit on the same line as the input.
Now onto the generated content. We create it using this CSS:
css
Copy to Clipboard
input + span {
  position: relative;
}


input:required + span::after {
  font-size: 0.7rem;
  position: absolute;
  content: "required";
  color: white;
  background-color: black;
  padding: 5px 10px;
  top: -26px;
  left: -70px;
}

We set the <span> to position: relative so that we can set the generated content to position: absolute and position it relative to the <span> rather than the <body> (The generated content acts as though it is a child node of the element it is generated on, for the purposes of positioning).
Then we give the generated content the content "required", which is what we wanted our label to say, and style and position it as we want. The result is seen below.
Styling controls based on whether their data is valid
The other really important, fundamental concept in form validation is whether a form control's data is valid or not (in the case of numerical data, we can also talk about in-range and out-of-range data). Form controls with constraint limitations can be targeted based on these states.
:valid and :invalid
You can target form controls using the :valid and :invalid pseudo-classes. Some points worth bearing in mind:
Controls with no constraint validation will always be valid, and therefore matched with :valid.
Controls with required set on them that have no value are counted as invalid — they will be matched with :invalid and :required.
Controls with built-in validation, such as <input type="email"> or <input type="url"> are (matched with) :invalid when the data entered into them does not match the pattern they are looking for (but they are valid when empty).
Controls whose current value is outside the range limits specified by the min and max attributes are (matched with) :invalid, but also matched by :out-of-range, as you'll see later on.
There are some other ways to make an element matched by :valid/:invalid, as you'll see in the Client-side form validation article. But we'll keep things simple for now.
Let's go in and look at an example of :valid/:invalid (see valid-invalid.html for the live version, and also check out the source code).
As in the previous example, we've got extra <span>s to generate content on, which we'll use to provide indicators of valid/invalid data:
html
Copy to Clipboard
<div>
  <label for="fname">First name: </label>
  <input id="fname" name="fname" type="text" required />
  <span></span>
</div>

To provide these indicators, we use the following CSS:
css
Copy to Clipboard
input + span {
  position: relative;
}


input + span::before {
  position: absolute;
  right: -20px;
  top: 5px;
}


input:invalid {
  border: 2px solid red;
}


input:invalid + span::before {
  content: "✖";
  color: red;
}


input:valid + span::before {
  content: "✓";
  color: green;
}

As before, we set the <span>s to position: relative so that we can position the generated content relative to them. We then absolutely position different generated content depending on whether the form's data is valid or invalid — a green check or a red cross, respectively. To add a bit of extra urgency to the invalid data, we've also given the inputs a thick red border when invalid.
Note: We've used ::before to add these labels, as we were already using ::after for the "required" labels.
You can try it below:
Notice how the required text inputs are invalid when empty, but valid when they have something filled in. The email input on the other hand is valid when empty, as it is not required, but invalid when it contains something that is not a proper email address.
In-range and out-of-range data
As we hinted at above, there are two other related pseudo-classes to consider — :in-range and :out-of-range. These match numeric inputs where range limits are specified by the min and max, when their data is inside or outside the specified range, respectively.
Note: Numeric input types are date, month, week, time, datetime-local, number, and range.
It is worth noting that inputs whose data is in-range will also be matched by the :valid pseudo-class and inputs whose data is out-of-range will also be matched by the :invalid pseudo-class. So why have both? The issue is really one of semantics — out-of-range is a more specific type of invalid communication, so you might want to provide a different message for out-of-range inputs, which will be more helpful to users than just saying "invalid". You might even want to provide both.
Let's look at an example that does exactly this. Our out-of-range.html demo (see also the source code) builds on top of the previous example to provide out-of-range messages for the numeric inputs, as well as saying whether they are required.
The numeric input looks like this:
html
Copy to Clipboard
<div>
  <label for="age">Age (must be 12+): </label>
  <input id="age" name="age" type="number" min="12" max="120" required />
  <span></span>
</div>

And the CSS looks like this:
css
Copy to Clipboard
input + span {
  position: relative;
}


input + span::after {
  font-size: 0.7rem;
  position: absolute;
  padding: 5px 10px;
  top: -26px;
}


input:required + span::after {
  color: white;
  background-color: black;
  content: "Required";
  left: -70px;
}


input:out-of-range + span::after {
  color: white;
  background-color: red;
  width: 155px;
  content: "Outside allowable value range";
  left: -182px;
}

This is a similar story to what we had before in the :required example, except that here we've split out the declarations that apply to any ::after content into a separate rule, and given the separate ::after content for :required and :out-of-range states their own content and styling. You can try it here:
It is possible for the number input to be both required and out-of-range at the same time, so what happens then? Because the :out-of-range rule appears later in the source code than the :required rule, the cascade rules come into play, and the out of range message is shown.
This works quite nicely — when the page first loads, "Required" is shown, along with a red cross and border. When you've typed in a valid age (i.e., in the range of 12-120), the input turns valid. If however, you then change the age entry to one that is out of range, the "Outside allowable value range" message then pops up in place of "Required".
Note: To enter an invalid/out-of-range value, you'll have to actually focus the form and type it in using the keyboard. The spinner buttons won't let you increment/decrement the value outside the allowable range.
Styling enabled and disabled inputs, and read-only and read-write
An enabled element is an element that can be activated; it can be selected, clicked on, typed into, etc. A disabled element on the other hand cannot be interacted with in any way, and its data isn't even sent to the server.
These two states can be targeted using :enabled and :disabled. Why are disabled inputs useful? Well, sometimes if some data does not apply to a certain user, you might not even want to submit that data when they submit the form. A classic example is a shipping form — commonly you'll get asked if you want to use the same address for billing and shipping; if so, you can just send a single address to the server, and might as well just disable the billing address fields.
Let's have a look at an example that does just this. First of all, the HTML is a simple form containing text inputs, plus a checkbox to toggle disabling the billing address on and off. The billing address fields are disabled by default.
html
Copy to Clipboard
<form>
  <fieldset id="shipping">
    <legend>Shipping address</legend>
    <div>
      <label for="name1">Name: </label>
      <input id="name1" name="name1" type="text" required />
    </div>
    <div>
      <label for="address1">Address: </label>
      <input id="address1" name="address1" type="text" required />
    </div>
    <div>
      <label for="zip-code1">Zip/postal code: </label>
      <input id="zip-code1" name="zip-code1" type="text" required />
    </div>
  </fieldset>
  <fieldset id="billing">
    <legend>Billing address</legend>
    <div>
      <label for="billing-checkbox">Same as shipping address:</label>
      <input type="checkbox" id="billing-checkbox" checked />
    </div>
    <div>
      <label for="name" class="billing-label disabled-label">Name: </label>
      <input id="name" name="name" type="text" disabled required />
    </div>
    <div>
      <label for="address2" class="billing-label disabled-label">
        Address:
      </label>
      <input id="address2" name="address2" type="text" disabled required />
    </div>
    <div>
      <label for="zip-code2" class="billing-label disabled-label">
        Zip/postal code:
      </label>
      <input id="zip-code2" name="zip-code2" type="text" disabled required />
    </div>
  </fieldset>


  <div><button>Submit</button></div>
</form>

Now onto the CSS. The most relevant parts of this example are as follows:
css
Copy to Clipboard
input[type="text"]:disabled {
  background: #eee;
  border: 1px solid #ccc;
}


label:has(+ :disabled) {
  color: #aaa;
}

We've directly selected the inputs we want to disable using input[type="text"]:disabled, but we also wanted to gray out the corresponding text labels. As the labels are right before their inputs, we selected those using the pseudo-class :has.
Now finally, we've used some JavaScript to toggle the disabling of the billing address fields:
js
Copy to Clipboard
// Wait for the page to finish loading
document.addEventListener(
  "DOMContentLoaded",
  () => {
    // Attach `change` event listener to checkbox
    document
      .getElementById("billing-checkbox")
      .addEventListener("change", toggleBilling);
  },
  false,
);


function toggleBilling() {
  // Select the billing text fields
  const billingItems = document.querySelectorAll('#billing input[type="text"]');


  // Toggle the billing text fields
  for (const item of billingItems) {
    item.disabled = !item.disabled;
  }
}

It uses the change event to let the user enable/disable the billing fields, and toggle the styling of the associated labels.
You can see the example in action below (also see it live here, and see the source code):
Read-only and read-write
In a similar manner to :disabled and :enabled, the :read-only and :read-write pseudo-classes target two states that form inputs toggle between. As with disabled inputs, the user can't edit read-only inputs. However, unlike disabled inputs, read-only input values will be submitted to the server. Read-write means they can be edited — their default state.
An input is set to read-only using the readonly attribute. As an example, imagine a confirmation page where the developer has sent the details filled in on previous pages over to this page, with the aim of getting the user to check them all in one place, add any final data that is needed, and then confirm the order by submitting. At this point, all the final form data can be sent to the server in one go.
Let's look at what a form might look like (see readonly-confirmation.html for the live example; also see the source code).
A fragment of the HTML is as follows — note the readonly attribute:
html
Copy to Clipboard
<div>
  <label for="name">Name: </label>
  <input id="name" name="name" type="text" value="Mr Soft" readonly />
</div>

If you try the live example, you'll see that the top set of form elements are not editable, however, the values are submitted when the form is submitted. We've styled the form controls using the :read-only and :read-write pseudo-classes, like so:
css
Copy to Clipboard
input:read-only,
textarea:read-only {
  border: 0;
  box-shadow: none;
  background-color: white;
}


textarea:read-write {
  box-shadow: inset 1px 1px 3px #ccc;
  border-radius: 5px;
}

The full example looks like this:
Note: :enabled and :read-write are two more pseudo-classes that you'll probably rarely use, given that they describe the default states of input elements.
Radio and checkbox states — checked, default, indeterminate
As we've seen in earlier articles in the module, radio buttons and checkboxes can be checked or unchecked. But there are a couple of other states to consider too:
:default: Matches radios/checkboxes that are checked by default, on page load (i.e., by setting the checked attribute on them). These match the :default pseudo-class, even if the user unchecks them.
:indeterminate: When radios/checkboxes are neither checked nor unchecked, they are considered indeterminate and will match the :indeterminate pseudo-class. More on what this means below.
:checked
When checked, they will be matched by the :checked pseudo-class.
The most common use of this is to add a different style onto the checkbox or radio button when it is checked, in cases where you've removed the system default styling with appearance: none; and want to build the styles back up yourself. We saw examples of this in the previous article when we talked about Using appearance: none on radios/checkboxes.
As a recap, the :checked code from our Styled radio buttons example looks like so:
css
Copy to Clipboard
input[type="radio"]::before {
  display: block;
  content: " ";
  width: 10px;
  height: 10px;
  border-radius: 6px;
  background-color: red;
  font-size: 1.2em;
  transform: translate(3px, 3px) scale(0);
  transform-origin: center;
  transition: all 0.3s ease-in;
}


input[type="radio"]:checked::before {
  transform: translate(3px, 3px) scale(1);
  transition: all 0.3s cubic-bezier(0.25, 0.25, 0.56, 2);
}

You can try it out here:
Basically, we build the styling for a radio button's "inner circle" using the ::before pseudo-element, but set a scale(0) transform on it. We then use a transition to make the generated content on the label nicely animate into view when the radio is selected/checked. The advantage of using a transform rather than transitioning width/height is that you can use transform-origin to make it grow from the center of the circle, rather than having it appear to grow from the circle's corner, and there is no jumping behavior as no box model property values are updated.
:default and :indeterminate
As mentioned above, the :default pseudo-class matches radios/checkboxes that are checked by default, on page load, even when unchecked. This could be useful for adding an indicator to a list of options to remind the user what the defaults (or starting options) were, in case they want to reset their choices.
Also, the radios/checkboxes mentioned above will be matched by the :indeterminate pseudo-class when they are in a state where they are neither checked nor unchecked. But what does this mean? Elements that are indeterminate include:
<input/radio> inputs, when all radio buttons in a same-named group are unchecked
<input/checkbox> inputs whose indeterminate property is set to true via JavaScript
<progress> elements that have no value.
This isn't something you'll likely use very often. One use case could be an indicator to tell users that they really need to select a radio button before they move on.
Let's look at a couple of modified versions of the previous example that remind the user what the default option was, and style the labels of radio buttons when indeterminate. Both of these have the following HTML structure for the inputs:
html
Copy to Clipboard
<p>
  <input type="radio" name="fruit" value="cherry" id="cherry" />
  <label for="cherry">Cherry</label>
  <span></span>
</p>

For the :default example, we've added the checked attribute to the middle radio button input, so it will be selected by default when loaded. We then style this with the following CSS:
css
Copy to Clipboard
input ~ span {
  position: relative;
}


input:default ~ span::after {
  font-size: 0.7rem;
  position: absolute;
  content: "Default";
  color: white;
  background-color: black;
  padding: 5px 10px;
  right: -65px;
  top: -3px;
}

This provides a little "Default" label on the item that was originally selected when the page loaded. Note here we are using the subsequent-sibling combinator (~) rather than the Next-sibling combinator (+) — we need to do this because the <span> does not come right after the <input> in the source order.
See the live result below:
Note: You can also find the example live on GitHub at radios-checked-default.html (also see the source code.)
For the :indeterminate example, we've got no default selected radio button — this is important — if there was, then there would be no indeterminate state to style. We style the indeterminate radio buttons with the following CSS:
css
Copy to Clipboard
input[type="radio"]:indeterminate {
  outline: 2px solid red;
  animation: 0.4s linear infinite alternate outline-pulse;
}


@keyframes outline-pulse {
  from {
    outline: 2px solid red;
  }


  to {
    outline: 6px solid red;
  }
}

This creates a fun little animated outline on the radio buttons, which hopefully indicates that you need to select one of them!
See the live result below:
Note: You can also find the example live on GitHub at radios-checked-indeterminate.html (also see the source code.)
Note: You can find an interesting example involving indeterminate states on the <input type="checkbox"> reference page.
More pseudo-classes
There are a number of other pseudo-classes of interest, and we don't have space to write about them all in detail here. Let's talk about a few more that you should take the time to investigate.
The :focus-within pseudo-class matches an element that has received focus or contains an element that has received focus. This is useful if you want a whole form to highlight in some way when an input inside it is focused.
The :focus-visible pseudo-class matches focused elements that received focus via keyboard interaction (rather than touch or mouse) — useful if you want to show a different style for keyboard focus compared to mouse (or other) focus.
The :placeholder-shown pseudo-class matches <input> and <textarea> elements that have their placeholder showing (i.e., the contents of the placeholder attribute) because the value of the element is empty.
The following are also interesting, but as yet not well-supported in browsers:
The :blank pseudo-class selects empty form controls. :empty also matches elements that have no children, like <input>, but it is more general — it also matches other void elements like <br> and <hr>. :empty has reasonable browser support; the :blank pseudo-class's specification is not yet finished, so it is not yet supported in any browser.
The :user-invalid pseudo-class, when supported, will be similar to :invalid, but with better user experience. If the value is valid when the input receives focus, the element may match :invalid as the user enters data if the value is temporarily invalid, but will only match :user-invalid when the element loses focus. If the value was originally invalid, it will match both :invalid and :user-invalid for the whole duration of the focus. In a similar manner to :invalid, it will stop matching :user-invalid if the value does become valid.
Summary
This completes our look at UI pseudo-classes that relate to form inputs. Keep playing with them, and create some fun form styles! Next up, we'll move on to something different — client-side form validation.

Client-side form validation
Previous


Overview: Web forms


Next


It is important to ensure all required form controls are filled out, in the correct format, before submitting user entered form data to the server. This client-side form validation helps ensure data entered matches the requirements set forth in the various form controls.
This article leads you through basic concepts and examples of client-side form validation.
Prerequisites:
Computer literacy, a reasonable understanding of HTML, CSS, and JavaScript.
Objective:
To understand what client-side form validation is, why it's important, and how to apply various techniques to implement it.


Client-side validation is an initial check and an important feature of good user experience; by catching invalid data on the client-side, the user can fix it straight away. If it gets to the server and is then rejected, a noticeable delay is caused by a round trip to the server and then back to the client-side to tell the user to fix their data.
However, client-side validation should not be considered an exhaustive security measure! Your apps should always perform validation, including security checks, on any form-submitted data on the server-side as well as the client-side, because client-side validation is too easy to bypass, so malicious users can still easily send bad data through to your server.
Note: Read Website security for an idea of what could happen; implementing server-side validation is somewhat beyond the scope of this module, but you should bear it in mind.
What is form validation?
Go to any popular site with a registration form, and you will notice that they provide feedback when you don't enter your data in the format they are expecting. You'll get messages such as:
"This field is required" (You can't leave this field blank).
"Please enter your phone number in the format xxx-xxxx" (A specific data format is required for it to be considered valid).
"Please enter a valid email address" (the data you entered is not in the right format).
"Your password needs to be between 8 and 30 characters long and contain one uppercase letter, one symbol, and a number." (A very specific data format is required for your data).
This is called form validation. When you enter data, the browser (and the web server) will check to see that the data is in the correct format and within the constraints set by the application. Validation done in the browser is called client-side validation, while validation done on the server is called server-side validation. In this chapter we are focusing on client-side validation.
If the information is correctly formatted, the application allows the data to be submitted to the server and (usually) saved in a database; if the information isn't correctly formatted, it gives the user an error message explaining what needs to be corrected, and lets them try again.
We want to make filling out web forms as easy as possible. So why do we insist on validating our forms? There are three main reasons:
We want to get the right data, in the right format. Our applications won't work properly if our users' data is stored in the wrong format, is incorrect, or is omitted altogether.
We want to protect our users' data. Forcing our users to enter secure passwords makes it easier to protect their account information.
We want to protect ourselves. There are many ways that malicious users can misuse unprotected forms to damage the application. See Website security.
Warning: Never trust data passed to your server from the client. Even if your form is validating correctly and preventing malformed input on the client-side, a malicious user can still alter the network request.
Different types of client-side validation
There are two different types of client-side validation that you'll encounter on the web:
HTML form validation HTML form attributes can define which form controls are required and which format the user-entered data must be in to be valid.
JavaScript form validation JavaScript is generally included to enhance or customize HTML form validation.
Client side validation can be accomplished with little to no JavaScript. HTML validation is faster than JavaScript, but is less customizable than JavaScript validation. It is generally recommended to begin your forms using robust HTML features, then enhance the user experience with JavaScript as needed.
Using built-in form validation
One of the most significant features of form controls is the ability to validate most user data without relying on JavaScript. This is done by using validation attributes on form elements. We've seen many of these earlier in the course, but to recap:
required: Specifies whether a form field needs to be filled in before the form can be submitted.
minlength and maxlength: Specifies the minimum and maximum length of textual data (strings).
min, max, and step: Specifies the minimum and maximum values of numerical input types, and the increment, or step, for values, starting from the minimum.
type: Specifies whether the data needs to be a number, an email address, or some other specific preset type.
pattern: Specifies a regular expression that defines a pattern the entered data needs to follow.
If the data entered in a form field follows all of the rules specified by the attributes applied to the field, it is considered valid. If not, it is considered invalid.
When an element is valid, the following things are true:
The element matches the :valid CSS pseudo-class, which lets you apply a specific style to valid elements. The control will also match :user-valid if the user has interacted with the control, and may match other UI pseudo-classes, such as :in-range, depending on the input type and attributes.
If the user tries to send the data, the browser will submit the form, provided there is nothing else stopping it from doing so (e.g., JavaScript).
When an element is invalid, the following things are true:
The element matches the :invalid CSS pseudo-class. If the user has interacted with the control, it also matches the :user-invalid CSS pseudo-class. Other UI pseudo-classes may also match, such as :out-of-range, depending on the error. These let you apply a specific style to invalid elements.
If the user tries to send the data, the browser will block the form submission and display an error message. The error message will differ depending on the type of error. The Constraint Validation API is described below.
Built-in form validation examples
In this section, we'll test out some of the attributes that we discussed above.
Simple start file
Let's start with a simple example: an input that allows you to choose whether you prefer a banana or a cherry. This example involves a basic text <input> with an associated <label> and a submit <button>.
html
Copy to Clipboard
play
<form>
  <label for="choose">Would you prefer a banana or cherry?</label>
  <input id="choose" name="i-like" />
  <button>Submit</button>
</form>


css
Copy to Clipboard
play
input:invalid {
  border: 2px dashed red;
}

input:valid {
  border: 2px solid black;
}


play
To begin, make a copy of the fruit-start.html file found on GitHub in a new directory on your hard drive.
The required attribute
A common HTML validation feature is the required attribute. Add this attribute to an input to make an element mandatory. When this attribute is set, the element matches the :required UI pseudo-class and the form won't submit, displaying an error message on submission, if the input is empty. While empty, the input will also be considered invalid, matching the :invalid UI pseudo-class.
If any radio button in a same-named group has the required attribute, one of the radio buttons in that group must be checked for the group to be valid; the checked radio doesn't have to be the one with the attribute set.
Note: Only require users to input data you need: For example, is it really necessary to know someone's gender or title?
Add a required attribute to your input, as shown below.
html
Copy to Clipboard
play
<form>
  <label for="choose">Would you prefer a banana or cherry? (required)</label>
  <input id="choose" name="i-like" required />
  <button>Submit</button>
</form>
We added "(required)" to the <label> to inform the user that the <input> is required. Indicating to the user when form fields are required is not only good user experience, it is required by WCAG accessibility guidelines.
We include CSS styles that are applied based on whether the element is required, valid, and invalid:
css
Copy to Clipboard
play
input:invalid {
  border: 2px dashed red;
}

input:invalid:required {
  background-image: linear-gradient(to right, pink, lightgreen);
}

input:valid {
  border: 2px solid black;
}
This CSS causes the input to have a red dashed border when it is invalid and a more subtle solid black border when valid. We also added a background gradient when the input is required and invalid. Try out the new behavior in the example below:
play
Try submitting the form from the live required example without a value. Note how the invalid input gets focus, a default error message ("Please fill out this field") appears, and the form is prevented from being sent. You can also see the source code on GitHub.
Validating against a regular expression
Another useful validation feature is the pattern attribute, which expects a Regular Expression as its value. A regular expression (regexp) is a pattern that can be used to match character combinations in text strings, so regexps are ideal for form validation and serve a variety of other uses in JavaScript.
Regexps are quite complex, and we don't intend to teach you them exhaustively in this article. Below are some examples to give you a basic idea of how they work.
a — Matches one character that is a (not b, not aa, and so on).
abc — Matches a, followed by b, followed by c.
ab?c — Matches a, optionally followed by a single b, followed by c. (ac or abc)
ab*c — Matches a, optionally followed by any number of bs, followed by c. (ac, abc, abbbbbc, and so on).
a|b — Matches one character that is a or b.
abc|xyz — Matches exactly abc or exactly xyz (but not abcxyz or a or y, and so on).
There are many more possibilities that we don't cover here. For a complete list and many examples, consult our Regular expression documentation.
Let's implement an example. Update your HTML to add a pattern attribute like this:
html
Copy to Clipboard
play
<form>
  <label for="choose">Would you prefer a banana or a cherry?</label>
  <input id="choose" name="i-like" required pattern="[Bb]anana|[Cc]herry" />
  <button>Submit</button>
</form>
This gives us the following update — try it out:
play
You can find this example live on GitHub along with the source code.
In this example, the <input> element accepts one of four possible values: the strings "banana", "Banana", "cherry", or "Cherry". Regular expressions are case-sensitive, but we've made it support capitalized as well as lower-case versions using an extra "Aa" pattern nested inside square brackets.
At this point, try changing the value inside the pattern attribute to equal some of the examples you saw earlier, and look at how that affects the values you can enter to make the input value valid. Try writing some of your own, and see how it goes. Make them fruit-related where possible so that your examples make sense!
If a non-empty value of the <input> doesn't match the regular expression's pattern, the input will match the :invalid pseudo-class. If empty, and the element is not required, it is not considered invalid.
Some <input> element types don't need a pattern attribute to be validated against a regular expression. For example, specifying the email type validates the inputs value against a well-formed email address pattern or a pattern matching a comma-separated list of email addresses if it has the multiple attribute.
Note: The <textarea> element doesn't support the pattern attribute.
Constraining the length of your entries
You can constrain the character length of all text fields created by <input> or <textarea> by using the minlength and maxlength attributes. A field is invalid if it has a value and that value has fewer characters than the minlength value or more than the maxlength value.
Browsers often don't let the user type a longer value than expected into text fields. A better user experience than just using maxlength is to also provide character count feedback in an accessible manner and let the user edit their content down to size. An example of this is the character limit when posting on social media. JavaScript, including solutions using maxlength, can be used to provide this.
Note: Length constraints are never reported if the value is set programmatically. They are only reported for user-provided input.
Constraining the values of your entries
For numeric fields, including <input type="number"> and the various date input types, the min and max attributes can be used to provide a range of valid values. If the field contains a value outside this range, it will be invalid.
Let's look at another example. Create a new copy of the fruit-start.html file.
Now delete the contents of the <body> element, and replace it with the following:
html
Copy to Clipboard
play
<form>
  <div>
    <label for="choose">Would you prefer a banana or a cherry?</label>
    <input
      type="text"
      id="choose"
      name="i-like"
      required
      minlength="6"
      maxlength="6" />
  </div>
  <div>
    <label for="number">How many would you like?</label>
    <input type="number" id="number" name="amount" value="1" min="1" max="10" />
  </div>
  <div>
    <button>Submit</button>
  </div>
</form>


Here you'll see that we've given the text field a minlength and maxlength of six, which is the same length as banana and cherry.
We've also given the number field a min of one and a max of ten. Entered numbers outside this range will show as invalid; users won't be able to use the increment/decrement arrows to move the value outside of this range. If the user manually enters a number outside of this range, the data is invalid. The number is not required, so removing the value will result in a valid value.
Here is the example running live:
play
Try this example live on GitHub and view the source code.
Numeric input types, like number, range and date, can also take the step attribute. This attribute specifies what increment the value will go up or down by when the input controls are used (such as the up and down number buttons, or sliding the ranges thumb). The step attribute is omitted in our example, so the value defaults to 1. This means that floats, like 3.2, will also show as invalid.
Full example
Here is a full example to show usage of HTML's built-in validation features. First, some HTML:
html
Copy to Clipboard
play
<form>
  <fieldset>
    <legend>
      Do you have a driver's license?<span aria-label="required">*</span>
    </legend>
    <input type="radio" required name="driver" id="r1" value="yes" /><label
      for="r1"
      >Yes</label
    >
    <input type="radio" required name="driver" id="r2" value="no" /><label
      for="r2"
      >No</label
    >
  </fieldset>
  <p>
    <label for="n1">How old are you?</label>
    <input type="number" min="12" max="120" step="1" id="n1" name="age" />
  </p>
  <p>
    <label for="t1"
      >What's your favorite fruit?<span aria-label="required">*</span></label
    >
    <input
      type="text"
      id="t1"
      name="fruit"
      list="l1"
      required
      pattern="[Bb]anana|[Cc]herry|[Aa]pple|[Ss]trawberry|[Ll]emon|[Oo]range" />
    <datalist id="l1">
      <option>Banana</option>
      <option>Cherry</option>
      <option>Apple</option>
      <option>Strawberry</option>
      <option>Lemon</option>
      <option>Orange</option>
    </datalist>
  </p>
  <p>
    <label for="t2">What's your email address?</label>
    <input type="email" id="t2" name="email" />
  </p>
  <p>
    <label for="t3">Leave a short message</label>
    <textarea id="t3" name="msg" maxlength="140" rows="5"></textarea>
  </p>
  <p>
    <button>Submit</button>
  </p>
</form>
And now some CSS to style the HTML:
css
Copy to Clipboard
play
form {
  font: 1em sans-serif;
  max-width: 320px;
}

p > label {
  display: block;
}

input[type="text"],
input[type="email"],
input[type="number"],
textarea,
fieldset {
  width: 100%;
  border: 1px solid #333;
  box-sizing: border-box;
}

input:invalid {
  box-shadow: 0 0 5px 1px red;
}

input:focus:invalid {
  box-shadow: none;
}
This renders as follows:
play
This full example is live on GitHub along with the source code.
See Validation-related attributes for a complete list of attributes that can be used to constrain input values and the input types that support them.
Validating forms using JavaScript
If you want to change the text of the native error messages, JavaScript is needed. In this section we will look at the different ways to do this.
The Constraint Validation API
The Constraint Validation API consists of a set of methods and properties available on the following form element DOM interfaces:
HTMLButtonElement (represents a <button> element)
HTMLFieldSetElement (represents a <fieldset> element)
HTMLInputElement (represents an <input> element)
HTMLOutputElement (represents an <output> element)
HTMLSelectElement (represents a <select> element)
HTMLTextAreaElement (represents a <textarea> element)
The Constraint Validation API makes the following properties available on the above elements.
validationMessage: Returns a localized message describing the validation constraints that the control doesn't satisfy (if any). If the control is not a candidate for constraint validation (willValidate is false) or the element's value satisfies its constraints (is valid), this will return an empty string.
validity: Returns a ValidityState object that contains several properties describing the validity state of the element. You can find full details of all the available properties in the ValidityState reference page; below is listed a few of the more common ones:
patternMismatch: Returns true if the value does not match the specified pattern, and false if it does match. If true, the element matches the :invalid CSS pseudo-class.
tooLong: Returns true if the value is longer than the maximum length specified by the maxlength attribute, or false if it is shorter than or equal to the maximum. If true, the element matches the :invalid CSS pseudo-class.
tooShort: Returns true if the value is shorter than the minimum length specified by the minlength attribute, or false if it is greater than or equal to the minimum. If true, the element matches the :invalid CSS pseudo-class.
rangeOverflow: Returns true if the value is greater than the maximum specified by the max attribute, or false if it is less than or equal to the maximum. If true, the element matches the :invalid and :out-of-range CSS pseudo-classes.
rangeUnderflow: Returns true if the value is less than the minimum specified by the min attribute, or false if it is greater than or equal to the minimum. If true, the element matches the :invalid and :out-of-range CSS pseudo-classes.
typeMismatch: Returns true if the value is not in the required syntax (when type is email or url), or false if the syntax is correct. If true, the element matches the :invalid CSS pseudo-class.
valid: Returns true if the element meets all its validation constraints, and is therefore considered to be valid, or false if it fails any constraint. If true, the element matches the :valid CSS pseudo-class; the :invalid CSS pseudo-class otherwise.
valueMissing: Returns true if the element has a required attribute, but no value, or false otherwise. If true, the element matches the :invalid CSS pseudo-class.
willValidate: Returns true if the element will be validated when the form is submitted; false otherwise.
The Constraint Validation API also makes the following methods available on the above elements and the form element.
checkValidity(): Returns true if the element's value has no validity problems; false otherwise. If the element is invalid, this method also fires an invalid event on the element.
reportValidity(): Reports invalid field(s) using events. This method is useful in combination with preventDefault() in an onSubmit event handler.
setCustomValidity(message): Adds a custom error message to the element; if you set a custom error message, the element is considered to be invalid, and the specified error is displayed. This lets you use JavaScript code to establish a validation failure other than those offered by the standard HTML validation constraints. The message is shown to the user when reporting the problem.
Implementing a customized error message
As you saw in the HTML validation constraint examples earlier, each time a user tries to submit an invalid form, the browser displays an error message. The way this message is displayed depends on the browser.
These automated messages have two drawbacks:
There is no standard way to change their look and feel with CSS.
They depend on the browser locale, which means that you can have a page in one language but an error message displayed in another language, as seen in the following Firefox screenshot.

Customizing these error messages is one of the most common use cases of the Constraint Validation API. Let's work through an example of how to do this.
We'll start with some HTML (feel free to put this in a blank HTML file; use a fresh copy of fruit-start.html as a basis, if you like):
html
Copy to Clipboard
<form>
  <label for="mail">
    I would like you to provide me with an email address:
  </label>
  <input type="email" id="mail" name="mail" />
  <button>Submit</button>
</form>
Add the following JavaScript to the page:
js
Copy to Clipboard
const email = document.getElementById("mail");

email.addEventListener("input", (event) => {
  if (email.validity.typeMismatch) {
    email.setCustomValidity("I am expecting an email address!");
  } else {
    email.setCustomValidity("");
  }
});
Here we store a reference to the email input, then add an event listener to it that runs the contained code each time the value inside the input is changed.
Inside the contained code, we check whether the email input's validity.typeMismatch property returns true, meaning that the contained value doesn't match the pattern for a well-formed email address. If so, we call the setCustomValidity() method with a custom message. This renders the input invalid, so that when you try to submit the form, submission fails and the custom error message is displayed.
If the validity.typeMismatch property returns false, we call the setCustomValidity() method with an empty string. This renders the input valid, so the form will submit. During validation, if any form control has a customError that is not the empty string, form submission is blocked.
You can try it out below:
You can find this example live on GitHub as custom-error-message.html, along with the source code.
Extending built-in form validation
The previous example showed how you can add a customized message for a particular type of error (validity.typeMismatch). It is also possible to use all of the built in form validation, and then add to it using setCustomValidity().
Here we demonstrate how you can extend the built in <input type="email"> validation to only accept addresses with the @example.com domain. We start with the HTML <form> below.
html
Copy to Clipboard
play
<form>
  <label for="mail">Email address (@example.com only):</label>
  <input type="email" id="mail" />
  <button>Submit</button>
</form>
The validation code is shown below. In the event of any new input the code first resets the custom validity message by calling setCustomValidity(""). It then uses email.validity.valid to check if the entered address is invalid and if so, returns from the event handler. This ensures that all the normal built-in validation checks are run while the entered text is not a valid email address.
Once the email address is valid, the code adds a custom constraint, calling setCustomValidity() with an error message if the address does not end with @example.com.
js
Copy to Clipboard
play
const email = document.getElementById("mail");

email.addEventListener("input", (event) => {
  // Validate with the built-in constraints
  email.setCustomValidity("");
  if (!email.validity.valid) {
    return;
  }

  // Extend with a custom constraints
  if (!email.value.endsWith("@example.com")) {
    email.setCustomValidity("Please enter an email address of @example.com");
  }
});
Try submitting an invalid email address, a valid email address that doesn't end in @example.com, and one that does end in @example.com.
play
A more detailed example
Now that we've seen a really basic example, let's see how we can use this API to build some slightly more complex custom validation.
First, the HTML. Again, feel free to build this along with us:
html
Copy to Clipboard
<form novalidate>
  <p>
    <label for="mail">
      <span>Please enter an email address:</span>
      <input type="email" id="mail" name="mail" required minlength="8" />
      <span class="error" aria-live="polite"></span>
    </label>
  </p>
  <button>Submit</button>
</form>
This form uses the novalidate attribute to turn off the browser's automatic validation. Setting the novalidate attribute on the form stops the form from showing its own error message bubbles, and allows us to instead display the custom error messages in the DOM in some manner of our own choosing. However, this doesn't disable support for the constraint validation API nor the application of CSS pseudo-classes like :valid, etc. That means that even though the browser doesn't automatically check the validity of the form before sending its data, you can still do it yourself and style the form accordingly.
Our input to validate is an <input type="email">, which is required, and has a minlength of 8 characters. Let's check these using our own code, and show a custom error message for each one.
We are aiming to show the error messages inside a <span> element. The aria-live attribute is set on that <span> to make sure that our custom error message will be presented to everyone, including it being read out to screen reader users.
Now onto some basic CSS to improve the look of the form slightly, and provide some visual feedback when the input data is invalid:
css
Copy to Clipboard
body {
  font: 1em sans-serif;
  width: 200px;
  padding: 0;
  margin: 0 auto;
}

p * {
  display: block;
}

input[type="email"] {
  appearance: none;

  width: 100%;
  border: 1px solid #333;
  margin: 0;

  font-family: inherit;
  font-size: 90%;

  box-sizing: border-box;
}

/* invalid fields */
input:invalid {
  border-color: #900;
  background-color: #fdd;
}

input:focus:invalid {
  outline: none;
}

/* error message styles */
.error {
  width: 100%;
  padding: 0;

  font-size: 80%;
  color: white;
  background-color: #900;
  border-radius: 0 0 5px 5px;

  box-sizing: border-box;
}

.error.active {
  padding: 0.3em;
}
Now let's look at the JavaScript that implements the custom error validation. There are many ways to pick a DOM node; here we get the form itself and the email input box, as well as the span element into which we will place the error message.
Using event handlers, we check if the form fields are valid each time the user types something. If there is an error, we show it. If there is no error, we remove any error messaging.
js
Copy to Clipboard
const form = document.querySelector("form");
const email = document.getElementById("mail");
const emailError = document.querySelector("#mail + span.error");

email.addEventListener("input", (event) => {
  if (email.validity.valid) {
    emailError.textContent = ""; // Remove the message content
    emailError.className = "error"; // Removes the `active` class
  } else {
    // If there is still an error, show the correct error
    showError();
  }
});

form.addEventListener("submit", (event) => {
  // if the email field is invalid
  if (!email.validity.valid) {
    // display an appropriate error message
    showError();
    // prevent form submission
    event.preventDefault();
  }
});

function showError() {
  if (email.validity.valueMissing) {
    // If empty
    emailError.textContent = "You need to enter an email address.";
  } else if (email.validity.typeMismatch) {
    // If it's not an email address,
    emailError.textContent = "Entered value needs to be an email address.";
  } else if (email.validity.tooShort) {
    // If the value is too short,
    emailError.textContent = `Email should be at least ${email.minLength} characters; you entered ${email.value.length}.`;
  }
  // Add the `active` class
  emailError.className = "error active";
}
Every time we change the value of the input, we check to see if it contains valid data. If it has then we remove any error message being shown. If the data is not valid, we run showError() to show the appropriate error.
Every time we try to submit the form, we again check to see if the data is valid. If so, we let the form submit. If not, we run showError() to show the appropriate error, and stop the form submitting with preventDefault().
The showError() function uses various properties of the input's validity object to determine what the error is, and then displays an error message as appropriate.
Here is the live result:
You can find this example live on GitHub as detailed-custom-validation.html along with the source code.
The constraint validation API gives you a powerful tool to handle form validation, letting you have enormous control over the user interface above and beyond what you can do with HTML and CSS alone.
Validating forms without a built-in API
In some cases, such as custom controls, you won't be able to or won't want to use the Constraint Validation API. You're still able to use JavaScript to validate your form, but you'll just have to write your own.
To validate a form, ask yourself a few questions:
What kind of validation should I perform?
You need to determine how to validate your data: string operations, type conversion, regular expressions, and so on. It's up to you.
What should I do if the form doesn't validate?
This is clearly a UI matter. You have to decide how the form will behave. Does the form send the data anyway? Should you highlight the fields that are in error? Should you display error messages?
How can I help the user to correct invalid data?
In order to reduce the user's frustration, it's very important to provide as much helpful information as possible in order to guide them in correcting their inputs. You should offer up-front suggestions so they know what's expected, as well as clear error messages. If you want to dig into form validation UI requirements, here are some useful articles you should read:
Help users enter the right data in forms
Validating input
How to Report Errors in Forms: 10 Design Guidelines
An example that doesn't use the constraint validation API
In order to illustrate this, the following is a simplified version of the previous example without the Constraint Validation API.
The HTML is almost the same; we just removed the HTML validation features.
html
Copy to Clipboard
play
<form>
  <p>
    <label for="mail">
      <span>Please enter an email address:</span>
    </label>
    <input type="text" id="mail" name="mail" />
    <span id="error" aria-live="polite"></span>
  </p>
  <button>Submit</button>
</form>
Similarly, the CSS doesn't need to change very much; we've just turned the :invalid CSS pseudo-class into a real class and avoided using the attribute selector.
css
Copy to Clipboard
play
body {
  font: 1em sans-serif;
  width: 200px;
  padding: 0;
  margin: 0 auto;
}

form {
  max-width: 200px;
}

p * {
  display: block;
}

input {
  appearance: none;
  width: 100%;
  border: 1px solid #333;
  margin: 0;

  font-family: inherit;
  font-size: 90%;

  box-sizing: border-box;
}

/* invalid fields */
input.invalid {
  border: 2px solid #900;
  background-color: #fdd;
}

input:focus.invalid {
  outline: none;
  /* make sure keyboard-only users see a change when focusing */
  border-style: dashed;
}

/* error messages */
#error {
  width: 100%;
  font-size: 80%;
  color: white;
  background-color: #900;
  border-radius: 0 0 5px 5px;
  box-sizing: border-box;
}

.active {
  padding: 0.3rem;
}
The big changes are in the JavaScript code, which needs to do much more heavy lifting.
js
Copy to Clipboard
play
const form = document.querySelector("form");
const email = document.getElementById("mail");
const error = document.getElementById("error");

// Regular expression for email validation as per HTML specification
const emailRegExp = /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d-]+(?:\.[a-z\d-]+)*$/i;

// Check if the email is valid
const isValidEmail = () => {
  const validity = email.value.length !== 0 && emailRegExp.test(email.value);
  return validity;
};

// Update email input class based on validity
const setEmailClass = (isValid) => {
  email.className = isValid ? "valid" : "invalid";
};

// Update error message and visibility
const updateError = (isValidInput) => {
  if (isValidInput) {
    error.textContent = "";
    error.removeAttribute("class");
  } else {
    error.textContent = "I expect an email, darling!";
    error.setAttribute("class", "active");
  }
};

// Initialize email validity on page load
const initializeValidation = () => {
  const emailInput = isValidEmail();
  setEmailClass(emailInput);
};

// Handle input event to update email validity
const handleInput = () => {
  const emailInput = isValidEmail();
  setEmailClass(emailInput);
  updateError(emailInput);
};

// Handle form submission to show error if email is invalid
const handleSubmit = (event) => {
  event.preventDefault();

  const emailInput = isValidEmail();
  setEmailClass(emailInput);
  updateError(emailInput);
};

// Now we can rebuild our validation constraint
// Because we do not rely on CSS pseudo-class, we have to
// explicitly set the valid/invalid class on our email field
window.addEventListener("load", initializeValidation);
// This defines what happens when the user types in the field
email.addEventListener("input", handleInput);
// This defines what happens when the user tries to submit the data
form.addEventListener("submit", handleSubmit);
The result looks like this:
play
As you can see, it's not that hard to build a validation system on your own. The difficult part is to make it generic enough to use both cross-platform and on any form you might create. There are many libraries available to perform form validation, such as Validate.js.
Summary
Client-side form validation sometimes requires JavaScript if you want to customize styling and error messages, but it always requires you to think carefully about the user. Always remember to help your users correct the data they provide. To that end, be sure to:
Display explicit error messages.
Be permissive about the input format.
Point out exactly where the error occurs, especially on large forms.
Once you have checked that the form is filled out correctly, the form can be submitted. We'll cover sending form data next.
Previous


Sending form data
Previous


Overview: Web forms


Once the form data has been validated on the client-side, it is okay to submit the form. And, since we covered validation in the previous article, we're ready to submit! This article looks at what happens when a user submits a form — where does the data go, and how do we handle it when it gets there? We also look at some of the security concerns associated with sending form data.
Prerequisites:
An understanding of HTML, and basic knowledge of HTTP and server-side programming.
Objective:
To understand what happens when form data is submitted, including getting a basic idea of how data is processed on the server.

First, we'll discuss what happens to the data when a form is submitted.
Client/server architecture
At its most basic, the web uses a client/server architecture that can be summarized as follows: a client (usually a web browser) sends a request to a server (most of the time a web server like Apache, Nginx, IIS, Tomcat, etc.), using the HTTP protocol. The server answers the request using the same protocol.

An HTML form on a web page is nothing more than a convenient user-friendly way to configure an HTTP request to send data to a server. This enables the user to provide information to be delivered in the HTTP request.
Note: To get a better idea of how client-server architectures work, read our Server-side website programming first steps module.
On the client side: defining how to send the data
The <form> element defines how the data will be sent. All of its attributes are designed to let you configure the request to be sent when a user hits a submit button. The two most important attributes are action and method.
The action attribute
The action attribute defines where the data gets sent. Its value must be a valid relative or absolute URL. If this attribute isn't provided, the data will be sent to the URL of the page containing the form — the current page.
In this example, the data is sent to an absolute URL — https://example.com:
html
Copy to Clipboard
<form action="https://example.com">…</form>

Here, we use a relative URL — the data is sent to a different URL on the same origin:
html
Copy to Clipboard
<form action="/somewhere_else">…</form>

When specified with no attributes, as below, the <form> data is sent to the same page that the form is present on:
html
Copy to Clipboard
<form>…</form>

Note: It's possible to specify a URL that uses the HTTPS (secure HTTP) protocol. When you do this, the data is encrypted along with the rest of the request, even if the form itself is hosted on an insecure page accessed using HTTP. On the other hand, if the form is hosted on a secure page but you specify an insecure HTTP URL with the action attribute, all browsers display a security warning to the user each time they try to send data because the data will not be encrypted.
The names and values of the non-file form controls are sent to the server as name=value pairs joined with ampersands. The action value should be a file on the server that can handle the incoming data, including ensuring server-side validation. The server then responds, generally handling the data and loading the URL defined by the action attribute, causing a new page load (or a refresh of the existing page, if the action points to the same page).
How the data is sent depends on the method attribute.
The method attribute
The method attribute defines how data is sent. The HTTP protocol provides several ways to perform a request; HTML form data can be transmitted via a number of different methods, the most common being the GET method and the POST method
To understand the difference between those two methods, let's step back and examine how HTTP works. Each time you want to reach a resource on the Web, the browser sends a request to a URL. An HTTP request consists of two parts: a header that contains a set of global metadata about the browser's capabilities, and a body that can contain information necessary for the server to process the specific request.
The GET method
The GET method is the method used by the browser to ask the server to send back a given resource: "Hey server, I want to get this resource." In this case, the browser sends an empty body. Because the body is empty, if a form is sent using this method the data sent to the server is appended to the URL.
Consider the following form:
html
Copy to Clipboard
<form action="http://www.foo.com" method="GET">
  <div>
    <label for="say">What greeting do you want to say?</label>
    <input name="say" id="say" value="Hi" />
  </div>
  <div>
    <label for="to">Who do you want to say it to?</label>
    <input name="to" id="to" value="Mom" />
  </div>
  <div>
    <button>Send my greetings</button>
  </div>
</form>

Since the GET method has been used, you'll see the URL www.foo.com/?say=Hi&to=Mom appear in the browser address bar when you submit the form.

The data is appended to the URL as a series of name/value pairs. After the URL web address has ended, we include a question mark (?) followed by the name/value pairs, each one separated by an ampersand (&). In this case, we are passing two pieces of data to the server:
say, which has a value of Hi
to, which has a value of Mom
The HTTP request looks like this:
http
Copy to Clipboard
GET /?say=Hi&to=Mom HTTP/2.0
Host: foo.com

Note: You can find this example on GitHub — see get-method.html (see it live also).
Note: The data will not be appended if the action URL scheme cannot handle queries, e.g., file:.
The POST method
The POST method is a little different. It's the method the browser uses to talk to the server when asking for a response that takes into account the data provided in the body of the HTTP request: "Hey server, take a look at this data and send me back an appropriate result." If a form is sent using this method, the data is appended to the body of the HTTP request.
Let's look at an example — this is the same form we looked at in the GET section above, but with the method attribute set to POST.
html
Copy to Clipboard
<form action="http://www.foo.com" method="POST">
  <div>
    <label for="say">What greeting do you want to say?</label>
    <input name="say" id="say" value="Hi" />
  </div>
  <div>
    <label for="to">Who do you want to say it to?</label>
    <input name="to" id="to" value="Mom" />
  </div>
  <div>
    <button>Send my greetings</button>
  </div>
</form>

When the form is submitted using the POST method, you get no data appended to the URL, and the HTTP request looks like so, with the data included in the request body instead:
http
Copy to Clipboard
POST / HTTP/2.0
Host: foo.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 13


say=Hi&to=Mom

The Content-Length header indicates the size of the body, and the Content-Type header indicates the type of resource sent to the server. We'll discuss these headers later on.
Note: You can find this example on GitHub — see post-method.html (see it live also).
Note: The GET method will be used instead if the action URL scheme cannot handle a request body, e.g., data:.
Viewing HTTP requests
HTTP requests are never displayed to the user (if you want to see them, you need to use tools such as the Firefox Network Monitor or the Chrome Developer Tools). As an example, your form data will be shown as follows in the Chrome Network tab. After submitting the form:
Open the developer tools.
Select "Network"
Select "All"
Select "foo.com" in the "Name" tab
Select "Request" (Firefox) or "Payload" (Chrome/Edge)
You can then get the form data, as shown in the image below.

The only thing displayed to the user is the URL called. As we mentioned above, with a GET request the user will see the data in their URL bar, but with a POST request they won't. This can be very important for two reasons:
If you need to send a password (or any other sensitive piece of data), never use the GET method or you risk displaying it in the URL bar, which would be very insecure.
If you need to send a large amount of data, the POST method is preferred because some browsers limit the sizes of URLs. In addition, many servers limit the length of URLs they accept.
On the server side: retrieving the data
Whichever HTTP method you choose, the server receives a string that will be parsed in order to get the data as a list of key/value pairs. The way you access this list depends on the development platform you use and on any specific frameworks you may be using with it.
Example: Raw PHP
PHP offers some global objects to access the data. Assuming you've used the POST method, the following example just takes the data and displays it to the user. Of course, what you do with the data is up to you. You might display it, store it in a database, send it by email, or process it in some other way.
php
Copy to Clipboard
<?php
  // The global $_POST variable allows you to access the data sent with the POST method by name
  // To access the data sent with the GET method, you can use $_GET
  $say = htmlspecialchars($_POST["say"]);
  $to  = htmlspecialchars($_POST["to"]);


  echo  $say, " ", $to;
?>

This example displays a page with the data we sent. You can see this in action in our example php-example.html file — which contains the same example form as we saw before, with a method of POST and an action of php-example.php. When it is submitted, it sends the form data to php-example.php, which contains the PHP code seen in the above block. When this code is executed, the output in the browser is Hi Mom.

Note: This example won't work when you load it into a browser locally — browsers cannot interpret PHP code, so when the form is submitted the browser will just offer to download the PHP file for you. To get it to work, you need to run the example through a PHP server of some kind. Good options for local PHP testing are MAMP (Mac and Windows) and XAMPP (Mac, Windows, Linux).
Note also that if you are using MAMP but don't have MAMP Pro installed (or if the MAMP Pro demo time trial has expired), you might have trouble getting it working. To get it working again, we have found that you can load up the MAMP app, then choose the menu options MAMP > Preferences > PHP, and set "Standard Version:" to "7.2.x" (x will differ depending on what version you have installed).
Example: Python
This example shows how you would use Python to do the same thing — display the submitted data on a web page. This uses the Flask framework for rendering the templates, handling the form data submission, etc. (see python-example.py).
python
Copy to Clipboard
from flask import Flask, render_template, request


app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def form():
    return render_template('form.html')


@app.route('/hello', methods=['GET', 'POST'])
def hello():
    return render_template('greeting.html', say=request.form['say'], to=request.form['to'])


if __name__ == "__main__":
    app.run()

The two templates referenced in the above code are as follows (these need to be in a subdirectory called templates in the same directory as the python-example.py file, if you try to run the example yourself):
form.html: The same form as we saw above in The POST method section but with the action set to {{ url_for('hello') }}. This is a Jinja template, which is basically HTML but can contain calls to the Python code that is running the web server contained in curly braces. url_for('hello') is basically saying "redirect to /hello when the form is submitted".
greeting.html: This template just contains a line that renders the two bits of data passed to it when it is rendered. This is done via the hello() function seen above, which runs when the /hello URL is navigated to.
Note: Again, this code won't work if you just try to load it into a browser directly. Python works a bit differently from PHP — to run this code locally you'll need to install Python/PIP, then install Flask using pip3 install flask. At this point, you should be able to run the example using python3 python-example.py, then navigate to localhost:5042 in your browser.
Other languages and frameworks
There are many other server-side technologies you can use for form handling, including Perl, Java, .Net, Ruby, etc. Just pick the one you like best. That said, it's worth noting that it's very uncommon to use these technologies directly because this can be tricky. It's more common to use one of the many high quality frameworks that make handling forms easier, such as:
Python
Django
Flask
web2py (easiest to get started with)
py4web (written by the same develops as web2py, has a more Django-like setup)
Node.js
Express
Next.js (for React apps)
Nuxt (for Vue apps)
Remix
PHP
Laravel
Laminas (formerly Zend Framework)
Symfony
Ruby
Ruby On Rails
Java
Spring Boot
It's worth noting that even using these frameworks, working with forms isn't necessarily easy. But it's much easier than trying to write all the functionality yourself from scratch, and will save you a lot of time.
Note: It is beyond the scope of this article to teach you any server-side languages or frameworks. The links above will give you some help, should you wish to learn them.
A special case: sending files
Sending files with HTML forms is a special case. Files are binary data — or considered as such — whereas all other data is text data. Because HTTP is a text protocol, there are special requirements for handling binary data.
The enctype attribute
This attribute lets you specify the value of the Content-Type HTTP header included in the request generated when the form is submitted. This header is very important because it tells the server what kind of data is being sent. By default, its value is application/x-www-form-urlencoded. In human terms, this means: "This is form data that has been encoded into URL parameters."
If you want to send files, you need to take three extra steps:
Set the method attribute to POST because file content can't be put inside URL parameters.
Set the value of enctype to multipart/form-data because the data will be split into multiple parts, one for each file plus one for the text data included in the form body (if the text is also entered into the form).
Include one or more <input type="file"> controls to allow your users to select the file(s) that will be uploaded.
For example:
html
Copy to Clipboard
<form method="post" action="https://www.foo.com" enctype="multipart/form-data">
  <div>
    <label for="file">Choose a file</label>
    <input type="file" id="file" name="myFile" />
  </div>
  <div>
    <button>Send the file</button>
  </div>
</form>

Note: Servers can be configured with a size limit for files and HTTP requests in order to prevent abuse.
Security issues
Each time you send data to a server, you need to consider security. HTML forms are by far the most common server attack vectors (places where attacks can occur). The problems never come from the HTML forms themselves — they come from how the server handles data.
The Website security article of our server-side learning topic discusses several common attacks and potential defenses against them in detail. You should go and check that article out, to get an idea of what's possible.
Be paranoid: Never trust your users
So, how do you fight these threats? This is a topic far beyond this guide, but there are a few rules to keep in mind. The most important rule is: never ever trust your users, including yourself; even a trusted user could have been hijacked.
All data that comes to your server must be checked and sanitized. Always. No exception.
Escape potentially dangerous characters. The specific characters you should be cautious with vary depending on the context in which the data is used and the server platform you employ, but all server-side languages have functions for this. Things to watch out for are character sequences that look like executable code (such as JavaScript or SQL commands).
Limit the incoming amount of data to allow only what's necessary.
Sandbox uploaded files. Store them on a different server and allow access to the file only through a different subdomain or even better through a completely different domain.
You should be able to avoid many/most problems if you follow these three rules, but it's always a good idea to get a security review performed by a competent third party. Don't assume that you've seen all the possible problems.
Summary
As we'd alluded to above, sending form data is easy, but securing an application can be tricky. Just remember that a front-end developer is not the one who should define the security model of the data. It's possible to perform client-side form validation, but the server can't trust this validation because it has no way to truly know what has really happened on the client-side.
If you've worked your way through these tutorials in order, you now know how to markup and style a form, do client-side validation, and have some idea about submitting a form.
See also
If you want to learn more about securing a web application, you can dig into these resources:
Server-side website programming first steps
The Open Web Application Security Project (OWASP)
Web Security by Mozilla


Understanding client-side web development tools
Overview: Extension modules


Next


Client-side tooling can be intimidating, but this series of articles aims to illustrate the purpose of some of the most common client-side tool types, explain the tools you can chain together, how to install them using package managers, and control them using the command line. We finish up by providing a complete toolchain example showing you how to get productive.
Prerequisites
Before starting this module, You should have learnt the fundamentals of HTML, CSS, and JavaScript. You should also be comfortable with using the terminal/command line.
Tutorials
Client-side tooling overview
In this article we provide an overview of modern web tooling, what kinds of tools are available and where you'll meet them in the lifecycle of web app development, and how to find help with individual tools.
Package management basics
In this article we'll look at package managers in some detail to understand how we can use them in our own projects — to install project tool dependencies, keep them up-to-date, and more.
Introducing a complete toolchain
In the final couple of articles in the series we will solidify your tooling knowledge by walking you through the process of building up a sample case study toolchain. We'll go all the way from setting up a sensible development environment and putting transformation tools in place to actually deploying your app. In this article we'll introduce the case study, set up our development environment, and set up our code transformation tools.
Deploying our app
In the final article in our series, we take the example toolchain we built up in the previous article and add to it so that we can deploy our sample app. We push the code to GitHub and deploy it to GitHub pages, and even show you how to add a simple test into the process.



Client-side tooling overview
Overview: Understanding client-side web development tools


Next


In this article, we provide an overview of modern web tooling, what kinds of tools are available and where you'll meet them in the lifecycle of web app development, and how to find help with individual tools.
Prerequisites:
Familiarity with the core HTML, CSS, and JavaScript languages.
Objective:
To understand what types of client-side tooling there are, and how to find tools and get help with them.

Overview of modern tooling
Writing software for the web has become more sophisticated through the ages. Although it is still entirely reasonable to write HTML, CSS, and JavaScript "by hand" there is now a wealth of tools that developers can use to speed up the process of building a website, or app.
There are some extremely well-established tools that have become common "household names" amongst the development community, and new tools are being written and released every day to solve specific problems. You might even find yourself writing a piece of software to aid your own development process, to solve a specific problem that existing tools don't already seem to handle.
It is easy to become overwhelmed by the sheer number of tools that can be included in a single project. Equally, a single configuration file for a tool like webpack can be hundreds of lines long, most of which are magical incantations that seem to do the job but which only a master engineer will fully understand!
From time to time, even the most experienced of web developers get stuck on a tooling problem; it is possible to waste hours attempting to get a tooling pipeline working before even touching a single line of application code. If you have found yourself struggling in the past, then don't worry — you are not alone.
In these articles, we won't answer every question about web tooling, but we will provide you with a useful starting point of understanding the fundamentals, which you can then build from. As with any complex topic, it is good to start small, and gradually work your way up to more advanced uses.
The modern tooling ecosystem
Today's modern developer tooling ecosystem is huge, so it's useful to have a broad idea of what main problems the tools are solving. If you jump on your favorite search engine and look for "front-end developer tools" you're going to hit a huge spectrum of results ranging from text editors, to browsers, to the type of pens you can use to take notes.
Though your choice of code editor is certainly a tooling choice, this series of articles will go beyond that, focusing on developer tools that help you produce web code more efficiently. We'll recommend a few particular tools and the following tutorials will show you how to use them. They are tools that are popular and standard at the time of writing. This does not preclude you from using other tools, if you are aware of their relative advantages.
From a high-level perspective, you can put client-side tools into the following four broad categories of problems to solve:
Environment — Tools that help you set up your development environment, such as installing and running other tools.
Safety net — Tools that are useful during your code development.
Transformation — Tools that transform code in some way, e.g., turning an intermediate language into JavaScript that a browser can understand.
Post-development — Tools that are useful after you have written your code, such as testing and deployment tools.
Let's look at each one of these in more detail.
Environment
The editor, operating system, and browser are all development environments. We will assume that you have already settled down with a choice you are most comfortable with. However, before installing and running other tools, there are yet two choices to make:
Where you are going to run the tools on. Most tools that are run locally are written in JavaScript, so you need a JavaScript interpreter on your computer that can be invoked from the command line (not the one in your browser). Node.js remains the industry standard and we will use it. Bun is intended as a drop-in replacement for Node.js, known for its speed and powerful APIs.
How you are going to install the tools, in other words, the package manager. Node provides npm by default, so we will use it. Yarn and pnpm are other popular choices, each with their own advantages such as speed, project management, etc.
Safety net
These are tools that make the code you write a little better.
This part of the tooling should be specific to your own development environment, though it's not uncommon for companies to have some kind of policy or pre-baked configuration available to install so that all their developers are using the same processes.
This includes anything that makes your development process easier for generating stable and reliable code. Safety net tooling should also help you either prevent mistakes or correct mistakes automatically without having to build your code from scratch each time.
A few very common safety net tool types you will find being used by developers are as follows.
Linters
Linters are tools that check through your code and tell you about any errors that are present, what error types they are, and what code lines they are present on. Often linters can be configured to not only report errors, but also report any violations of a specified style guide that your team might be using (for example code that is using the wrong number of spaces for indentation, or using template literals rather than regular string literals).
ESLint is the industry standard JavaScript linter — a highly configurable tool for catching potential syntax errors and encouraging "best practices" throughout your code. Some companies and projects have also shared their ESLint configs.
You can also find linting tools for other languages, such as stylelint.
Source code control
Also known as version control systems (VCS), source code control is essential for backing work up and working in teams. A typical VCS involves having a local version of the code that you make changes to. You then "push" changes to a "master" version of the code inside a remote repository stored on a server somewhere. There is usually a way of controlling and coordinating what changes are made to the "master" copy of the code, and when, so a team of developers doesn't end up overwriting each other's work all the time.
Git is the source code control system that most people use these days. It is primarily accessed via the command line but can be accessed via friendly user interfaces. With your code in a git repository, you can push it to your own server instance, or use a hosted source control website such as GitHub, GitLab, or Bitbucket.
We'll be using GitHub in this module. You can find more information about it at Git and GitHub.
Code formatters
Code formatters are somewhat related to linters, except that rather than point out errors in your code, they usually tend to make sure your code is formatted correctly, according to your style rules, ideally automatically fixing errors that they find.
Prettier is a very popular example of a code formatter, which we'll make use of later on in the module.
Type checkers
Type checkers are tools that help you write more reliable code by checking that your code is using the right types of data in the right places. This prevents common classes of bugs such as accessing nonexistent properties, unexpected undefined, etc.
TypeScript is the de facto standard type checker for JavaScript. It provides its own type annotation syntax and is somewhat a language in its own right, so we won't be covering it in this module.
Transformation
This stage of your web app lifecycle typically allows you to code in either "future code" (such as the latest CSS or JavaScript features that might not have native support in browsers yet) or code using another language entirely, such as TypeScript. Transformation tools will then generate browser-compatible code for you, to be used in production.
Generally, web development is thought of as three languages: HTML, CSS, and JavaScript, and there are transformation tools for all of these languages. Transformation offers three main benefits (amongst others):
The ability to write code using the latest language features and have that transformed into code that works on everyday devices. For example, you might want to write JavaScript using cutting-edge new language features, but still have your final production code work on older browsers that don't support those features. Good examples here include:
Babel: A JavaScript compiler that allows developers to write their code using cutting-edge JavaScript, which Babel then takes and converts into old-fashioned JavaScript that more browsers can understand. Developers can also write and publish plugins for Babel.
PostCSS: Does the same kind of thing as Babel, but for cutting-edge CSS features. If there isn't an equivalent way to do something using older CSS features, PostCSS will install a JavaScript polyfill to emulate the CSS effect you want.
The option to write your code in an entirely different language and have it transformed into a web-compatible language. For example:
Sass/SCSS: This CSS extension allows you to use variables, nested rules, mixins, functions, and many other features, some of which are available in native CSS (such as variables), and some of which aren't.
TypeScript: TypeScript is a superset of JavaScript that offers a bunch of additional features. The TypeScript compiler converts TypeScript code to JavaScript when building for production.
Frameworks such as React, Ember, and Vue: Frameworks provide a lot of functionality for free and allow you to use it via custom syntax built on top of vanilla JavaScript. In the background, the framework's JavaScript code works hard to interpret this custom syntax and render it as a final web app.
Optimization. This is provided by bundlers, which are tools that get your code ready for production, for example by "tree-shaking" to make sure only the parts of your code libraries that you are actually using are put into your final production code, or "minifying" to remove all the whitespace in your production code, making it as small as possible before it is uploaded to a server. For example:
Webpack has been the most popular bundler for a long time, featuring a huge number of plugins and a powerful configuration system. However, it is also known for being quite complex to set up, and is slow compared to more modern alternatives.
Vite is a more modern build tool that is popular for its speed, simplicity, and richness of features.
Post development
Post-development tooling ensures that your software makes it to the web and continues to run. This includes the deployment processes, testing frameworks, auditing tools, and more.
This stage of the development process is one that you want the least amount of active interaction with so that once it is configured, it runs mostly automatically, only popping up to say hello if something has gone wrong.
Testing tools
These generally take the form of a tool that will automatically run tests against your code to make sure it is correct before you go any further (for example, when you attempt to push changes to a GitHub repo). This can include linting, but also more sophisticated procedures like unit tests, where you run part of your code, making sure they behave as they should.
Frameworks for writing tests include Jest, Mocha, and Jasmine.
Automated test running and notification systems include Travis CI, Jenkins, Circle CI, and others.
Deployment tools
Deployment systems allow you to get your website published, are available for both static and dynamic sites, and commonly tend to work alongside testing systems. For example, a typical toolchain will wait for you to push changes to a remote repo, run some tests to see if the changes are OK, and then if the tests pass, automatically deploy your app to a production site.
GitHub Pages is nicely integrated with GitHub itself and is free for all public repos. Other services, such as Netlify and Vercel, are also very popular, featuring generous free tier quotas, smooth deployment workflows, and GitHub integration.
Others
There are several other tool types available to use in the post-development stage, including Code Climate for gathering code quality metrics, the Webhint browser extension for performing runtime analysis of cross-browser compatibility and other checks, GitHub bots for providing more powerful GitHub functionality, Updown for providing app uptime monitoring, and so many more!
Some thoughts about tooling types
There's certainly an order in which the different tooling types apply in the development lifecycle, but rest assured that you don't have to have all of these in place to release a website. In fact, you don't need any of these. However, including some of these tools in your process will improve your own development experience and likely improve the overall quality of your code.
It often takes some time for new developer tools to settle down in their complexity. One of the best-known tools, webpack, has a reputation for being overly complicated to work with, but in the latest major release, there was a huge push to simplify common usage so the configuration required is reduced down to an absolute minimum.
There's definitely no silver bullet that will guarantee success with tools, but as your experience increases you'll find workflows that work for you or for your team and their projects. Once all the kinks in the process are flattened out, your toolchain should be something you can forget about and it should just work.
How to choose and get help with a particular tool
Most tools tend to get written and released in isolation, so although there's almost certainly help available it's never in the same place or format. It can therefore be hard to find help with using a tool, or even to choose what tool to use. The knowledge about which are the best tools to use is a bit tribal, meaning that if you aren't already in the web community, it is hard to find out exactly which ones to go for! This is one reason we wrote this series of articles, to hopefully provide that first step that is hard to find otherwise.
You'll probably need a combination of the following things:
Experienced teachers, mentors, fellow students, or colleagues that have some experience, have solved such problems before, and can give advice.
A useful specific place to search. General web searches for front-end developer tools are generally useless unless you already know the name of the tool you are searching for.
If you are using the npm package manager to manage your dependencies for example, it is a good idea to go to the npm homepage and search for the type of tool you are looking for, for example try searching for "date" if you want a date formatting utility, or "formatter" if you are searching for a general code formatter. Pay attention to the popularity, quality, and maintenance scores, and how recently the package was last updated. Also click through to the tool pages to find out how many monthly downloads a package has, and whether it has good documentation that you can use to figure out whether it does what you need it to do. Based on these criteria, the date-fns library looks like a good date formatting tool to use. You'll see this tool in action and learn more about package managers in general in Chapter 3 of this module.
If you are looking for a plugin to integrate tool functionality into your code editor, look at the code editor's plugins/extensions page — see VS Code extensions, for example. Have a look at the featured extensions on the front page, and again, try searching for the kind of extension you want (or the tool name, for example search for "ESLint" on the VS Code extensions page). When you get results, have a look at information such as how many stars or downloads the extension has, as an indicator of its quality.
Development-related forums to ask questions on about what tools to use, for example MDN Learn Discourse, or Stack Overflow.
When you've chosen a tool to use, the first port of call should be the tool project homepage. This could be a full-blown website or it might be a single readme document in a code repository. The date-fns docs for example are pretty good, complete, and easy to follow. Some documentation however can be rather technical and academic and not a good fit for your learning needs.
Instead, you might want to find some dedicated tutorials on getting started with particular types of tools. A great starting place is to search websites like CSS Tricks, Dev, freeCodeCamp, and Smashing Magazine, as they're tailored to the web development industry.
Again, you'll probably go through several different tools as you search for the right ones for you, trying them out to see if they make sense, are well-supported, and do what you want them to do. This is fine — it is all good for learning, and the road will get smoother as you get more experience.
Summary
That rounds off our gentle introduction to the topic of client-side web tooling, from a high level. Next up we will look at package managers.

Package management basics
Previous


Overview: Understanding client-side web development tools


Next


In this article, we'll look at package managers in some detail to understand how we can use them in our own projects — to install project tool dependencies, keep them up-to-date, and more.
Prerequisites:
Familiarity with the core HTML, CSS, and JavaScript languages.
Objective:
To understand what package managers and package repositories are, why they are needed, and the basics of how to use them.

A dependency in your project
A dependency is a third-party bit of software that was probably written by someone else and ideally solves a single problem for you. A web project can have any number of dependencies, ranging from none to many, and your dependencies might include sub-dependencies that you didn't explicitly install — your dependencies may have their own dependencies.
A simple example of a useful dependency that your project might need is some code to calculate relative dates as human-readable text. You could certainly code this yourself, but there's a strong chance that someone else has already solved this problem — why waste time reinventing the wheel? Moreover, a reliable third-party dependency will likely have been tested in a lot of different situations, making it more robust and cross-browser compatible than your own solution.
A project dependency can be an entire JavaScript library or framework — such as React or Vue — or a very small utility like our human-readable date library, or it can be a command line tool such as Prettier or ESLint, which we talked about in previous articles.
Without modern build tools, dependencies like this might be included in your project using a simple <script> element, but this might not work right out of the box and you will likely need some modern tooling to bundle your code and dependencies together when they are released on the web. A bundle is a term that's generally used to refer to a single file on your web server that contains all the JavaScript for your software — typically compressed as much as possible to help reduce the time it takes to get your software downloaded and displayed in your visitors' browser.
In addition, what happens if you find a better tool that you want to use instead of the current one, or a new version of your dependency is released that you want to update to? This is not too painful for a couple of dependencies, but in larger projects with many dependencies, this kind of thing can become really challenging to keep track of. It makes more sense to use a package manager such as npm, as this will guarantee that the code is added and removed cleanly, as well as a host of other advantages.
What exactly is a package manager?
We've met npm already, but stepping back from npm itself, a package manager is a system that will manage your project dependencies.
The package manager will provide a method to install new dependencies (also referred to as "packages"), manage where packages are stored on your file system, and offer capabilities for you to publish your own packages.
In theory, you may not need a package manager and you could manually download and store your project dependencies, but a package manager will seamlessly handle installing and uninstalling packages. If you didn't use one, you'd have to manually handle:
Finding all the correct package JavaScript files.
Checking them to make sure they don't have any known vulnerabilities.
Downloading them and putting them in the correct locations in your project.
Writing the code to include the package(s) in your application (this tends to be done using JavaScript modules, another subject that is worth reading up on and understanding).
Doing the same thing for all of the packages' sub-dependencies, of which there could be tens, or hundreds.
Removing all the files again if you want to remove the packages.
In addition, package managers handle duplicate dependencies (something that becomes important and common in front-end development).
In the case of npm (and JavaScript- and Node-based package managers) you have two options for where you install your dependencies. As we touched on in the previous article, dependencies can be installed globally or locally to your project. Although there tend to be more pros for installing globally, the pros for installing locally are more important — such as code portability and version locking.
For example, if your project relied on webpack with a certain configuration, you'd want to ensure that if you installed that project on another machine or returned to it much later on, the configuration would still work. If a different version of webpack was installed, it may not be compatible. To mitigate this, dependencies are installed locally to a project.
To see local dependencies really shine, all you need to do is try to download and run an existing project — if it works and all the dependencies work right out of the box, then you have local dependencies to thank for the fact that the code is portable.
Note: npm is not the only package manager available. A successful and popular alternative package manager is Yarn. Yarn resolves the dependencies using a different algorithm that can mean a faster user experience. There are also a number of other emerging clients, such as pnpm.
Package registries
For a package manager to work, it needs to know where to install packages from, and this comes in the form of a package registry. The registry is a central place where a package is published and thus can be installed from. npm, as well as being a package manager, is also the name of the most commonly-used package registry for JavaScript packages. The npm registry exists at npmjs.com.
npm is not the only option. You could manage your own package registry — products like Microsoft Azure allow you to create proxies to the npm registry (so you can override or lock certain packages), GitHub also offers a package registry service, and there will be likely more options appearing as time goes on.
What is important is that you ensure you've chosen the best registry for you. Many projects will use npm, and we'll stick to this in our examples throughout the rest of the module.
Using the package ecosystem
Let's run through an example to get you started with using a package manager and registry to install a command line utility.
We will use Vite to create a blank website. In the next article, we will expand on the toolchain to include more tools and show you how to deploy the site.
Vite provides some init templates, with all necessary dependencies and configurations, to get you started quickly in a real project. For demonstration, we will configure one from scratch, using the React template as a reference.
Setting up the app as an npm package
First of all, create a new directory to store our experimental app in, somewhere sensible that you'll find again. We'll call it npm-experiment, but you can call it whatever you like:
bash
Copy to Clipboard
mkdir npm-experiment
cd npm-experiment

Next, let's initialize our app as an npm package, which creates a config file — package.json — that allows us to save our configuration details in case we want to recreate this environment later on, or even publish the package to the npm registry (although it's not relevant for our article, because we are developing an application, not a reusable library).
Type the following command, making sure you are inside the npm-experiment directory:
bash
Copy to Clipboard
npm init

You will now be asked some questions; npm will then create a default package.json file based on the answers. Note that none of these are relevant for our purposes because they are only used if you publish your package to a registry and others want to install and import it.
name: A name to identify the app. Just press Return to accept the default npm-experiment.
version: The starting version number for the app. Again, just press Return to accept the default 1.0.0.
description: A quick description of the app's purpose. We'll omit it here, but you can also enter anything you like. Press Return.
entry point: This will be the JavaScript file that is run when others import your package. It has no use for us, so just press Return.
test command, git repository, and keywords: press Return to leave each of these blank for now.
author: The author of the project. Type your own name, and press Return.
license: The license to publish the package under. Press Return to accept the default for now.
Press Return one more time to accept these settings.
Go into your npm-experiment directory and you should now find you've got a package.json file. Open it up and it should look something like this:
json
Copy to Clipboard
{
  "name": "npm-experiment",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Your name",
  "license": "ISC"
}

We will add two more lines to package.json:
"type": "module", which causes Node to interpret all .js files as ES modules rather than the old CommonJS modules. It's a generally good habit to get into.
"private": true, which prevents you from accidentally publishing your package to the npm registry.
Add these lines right below the "name":
json
Copy to Clipboard
"name": "npm-experiment",
"type": "module",
"private": true,

So this is the config file that defines your package. This is good for now, so let's move on.
Installing Vite
We will first install Vite, the build tool for our website. It is responsible for bundling our HTML, CSS, and JavaScript files into an optimized bundle for the browser.
bash
Copy to Clipboard
npm install --save-dev vite

Once that's done All The Things, take another look at your package.json file. You'll see that npm has added a new field, devDependencies:
json
Copy to Clipboard
"devDependencies": {
  "vite": "^5.2.13"
}

This is part of the npm magic — if in the future you move your codebase to another location, on another machine, you can recreate the same setup by running the command npm install, and npm will look at the dependencies and install them for you.
One disadvantage is that Vite is only available inside our npm-experiment app; you won't be able to run it in a different directory. But the advantages outweigh the disadvantages.
Note that we chose to install vite as a dev dependency. This difference rarely matters for an application, but for a library, it means when others install your package, they won't implicitly install Vite. Usually, for applications, any package imported in source code is a real dependency, while any package used for development (usually as command line tools) is a dev dependency. Install real dependencies by removing the --save-dev flag.
You'll find a number of new files created too:
node_modules: The dependency files required to run Vite. npm has downloaded all of them for you.
package-lock.json: This is a lockfile storing the exact information needed to reproduce the node_modules directory. This ensures that as long as the lockfile is unchanged, the node_modules directory will be the same across different machines.
You needn't worry about these files, as they are managed by npm. You should add node_modules to your .gitignore file if you are using Git, but you should generally keep package-lock.json, because as mentioned it's used to synchronize the node_modules state across different machines.
Setting up our example app
Anyway, on with the setup.
In Vite, the index.html file is front and central. It defines the starting point of your app, and Vite will use it to find other files needed to build your app. Create an index.html file in your npm-experiment directory, and give it the following contents:
html
Copy to Clipboard
<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <title>My test page</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

Note that the <script> elements creates a dependency on a file called src/main.jsx, which declares the entry point of the JavaScript logic for the app. Create the src folder and create main.jsx in this folder, but leave it blank for now.
Note: The type="module" attribute is important. It tells the browser to treat the script as an ES module, which allows us to use import and export syntax in our JavaScript code. The file extension is .jsx, because in the next article, we will add React JSX syntax to it. Browsers don't understand JSX, but Vite will transform it to regular JavaScript for us, as if browsers do!
Having fun with Vite
Now we'll run our newly installed Vite tool. In your terminal, run the following command:
bash
Copy to Clipboard
npx vite

You should see something like this printed in your terminal:
VITE v5.2.13  ready in 326 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help

Now we're ready to benefit from the full JavaScript package ecosystem. For a start, there is now a local web server running at http://localhost:5173. You'll not see anything for now, but what is cool is that when you do make changes to your app, Vite will rebuild it and refresh the server automatically so you can instantly see the effect your update had.
You can stop the dev server any time with Ctrl + C and start it again with the same command. If you decide to keep it running, you can open a new terminal window to run other commands.
Now for some page content. As a demonstration, let's add a graph to the page. We will use the plotly.js package, a data visualization library. Install it by running the following command:
bash
Copy to Clipboard
npm install plotly.js-dist-min

Note how we are installing without the --save-dev flag. As previously mentioned, this is because we will actually use this package in our source code, not just as a command line tool. This command will add a new "dependencies" object to your package.json file, with plotly.js-dist-min in it.
Note: Here, we chose the package for you to complete our task. When you are writing your own code, think about the following questions when finding and installing a dependency:
Do I need a dependency at all? Is it possible to do it with built-in features, or is it simple enough to write myself?
What exactly do I need to do? The more detailed you are, the more likely you are going to find a package that does exactly what you need. You can search for keywords on npm or Google. Also prefer small packages to big ones, as the latter may lead to performance issues when installing, running, etc.
Is the dependency trustable and well-maintained? Check when the last version was published, who the author is, and how many weekly downloads the package has. Determining the trustworthiness of a package is a skill that comes with experience, because you have to account for factors such as how likely the package needs updates, or how many people may need it.
In the src/main.jsx file, add the following code and save it:
js
Copy to Clipboard
import Plotly from "plotly.js-dist-min";

const root = document.getElementById("root");
Plotly.newPlot(
  root,
  [
    {
      x: [1, 2, 3, 4, 5],
      y: [1, 2, 4, 8, 16],
    },
  ],
  {
    margin: { t: 0 },
  },
);

Go back to http://localhost:5173 and you'll see a graph on the page. Change the different numbers and see the graph updated every time you save your file.
Building our code for production
However, this code is not ready for production. Most build tooling systems, including Vite, have a "development mode" and a "production mode". The important difference is that a lot of the helpful features you will use in development are not needed in the final site, so will be stripped out for production, e.g., "hot module replacement", "live reloading", and "uncompressed and commented source code". Though far from exhaustive, these are some of the common web development features that are very helpful at the development stage but are not very useful in production. In production, they will just bloat your site.
Now stop the running Vite dev server using Ctrl + C.
We can now prepare our bare bones example site for an imaginary deployment. Vite provides an additional build command to generate files that are suited to publication.
Run the following command:
bash
Copy to Clipboard
npx vite build

You should see an output like so:
vite v5.2.13 building for production...
✓ 6 modules transformed.
dist/index.html                    0.32 kB │ gzip:     0.24 kB
dist/assets/index-BlYAJQFz.js  3,723.18 kB │ gzip: 1,167.74 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 4.36s

Vite will create a directory called dist. If you look into it, it contains an index.html, which looks very similar to the root one, except that the script's source is now replaced with a path to the assets folder. The assets folder containing transformed JavaScript output, which is now minified and optimized for production.
Note: You may be worried about the warning that there's a chunk that's too large. This is expected because we are loading a library that does a lot of things behind the scenes (imagine writing all the code yourself to draw the same graph). For now, we don't need to worry about it.
A rough guide to package manager clients
This tutorial installed the Vite package using npm, but as mentioned earlier on there are some alternatives. It's worth at least knowing they exist and having some vague idea of the common commands across the tools. You've already seen some in action, but let's look at the others.
The list will grow over time, but at the time of writing, the following main package managers are available:
npm at npmjs.org
pnpm at pnpm.js.org
Yarn at yarnpkg.com
npm and pnpm are similar from a command line point of view — in fact, pnpm aims to have full parity over the argument options that npm offers. It differs in that it uses a different method for downloading and storing the packages on your computer, aiming to reduce the overall disk space required.
Where npm is shown in the examples below, pnpm can be swapped in and the command will work.
Yarn is often thought to be quicker than npm in terms of the installation process (though your mileage may vary). This is important to developers because there can be a significant amount of time wasted on waiting for dependencies to install (and copy to the computer).
However, worth noting that the npm package manager is not required to install packages from the npm registry. pnpm and Yarn can consume the same package.json format as npm, and can install any package from the npm and other package registries.
Let's review the common actions you'll want to perform with package managers.
Note: We will demonstrate both npm and Yarn commands. They are not meant to be run in the same project. You should set up your project with either npm or Yarn and use commands from that package manager consistently.
Initialize a new project
bash
Copy to Clipboard
npm init
yarn init

As shown above, this will prompt and walk you through a series of questions to describe your project (name, license, description, and so on) then generate a package.json for you that contains meta-information about your project and its dependencies.
Installing dependencies
bash
Copy to Clipboard
npm install vite
yarn add vite

We also saw install in action above. This would directly add the vite package to the working directory in a subdirectory called node_modules, along with vite's own dependencies.
By default, this command will install the latest version of vite, but you can control this too. You can ask for vite@4, which gives you the latest 4.x version (which is 4.5.3). Or you could try vite@^4.0.0, which means the latest version after or including 4.0.0 (the same meaning as above).
Updating dependencies
bash
Copy to Clipboard
npm update
yarn upgrade

This will look at the currently installed dependencies and update them, if there is an update available, within the range that's specified in the package.
The range is specified in the version of the dependency in your package.json, such as "vite": "^5.2.13" — in this case, the caret character ^ means all minor and patch releases after and including 5.2.13, up to but excluding 6.0.0.
This is determined using a system called semver, which might look a bit complicated from the documentation but can be simplified by considering only the summary information and that a version is represented by MAJOR.MINOR.PATCH, such as 2.0.1 being major version 2 with patch version 1. An excellent way to try out semver values is to use the semver calculator.
It's important to remember that npm update will not upgrade the dependencies to beyond the range defined in the package.json — to do this you will need to install that version specifically.
More commands
You can find out more about the individual commands for npm and yarn online. Again, pnpm commands will have parity with npm, with a handful of additions.
Making your own commands
The package managers also support creating your own commands and executing them from the command line. For instance, previously we invoked the command vite with npx to start the Vite dev server. We could create the following command:
bash
Copy to Clipboard
npm run dev
# or yarn run dev

This would run a custom script for starting our project in "development mode". In fact, we regularly include this in all projects as the local development setup tends to run slightly differently to how it would run in production.
If you tried running this in your test project from earlier it would (likely) claim the "dev script is missing". This is because npm, Yarn (and the like) are looking for a property called dev in the scripts property of your package.json file. So, let's create a custom shorthand command — "dev" — in our package.json. If you followed the tutorial from earlier, you should have a package.json file inside your npm-experiment directory. Open it up, and its scripts member should look like this:
json
Copy to Clipboard
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
},

Update it so that it looks like this, and save the file:
json
Copy to Clipboard
"scripts": {
  "dev": "vite"
},

We've added a custom dev command as an npm script.
Now try running the following in your terminal, making sure you are inside the npm-experiment directory:
bash
Copy to Clipboard
npm run dev

This should start Vite and start the same local development server, as we saw before.
Note that the script we defined here no longer need the npx prefix. This is because npm (and yarn) commands are clever in that they will search for command line tools that are locally installed to the project before trying to find them through conventional methods (where your computer will normally store and allow software to be found). You can learn more about the technical intricacies of the run command, although in most cases your own scripts will run just fine.
This particular one may look unnecessary — npm run dev is more characters to type than npx vite, but it is a form of abstraction. It allows us to add more work to the dev command in the future, such as setting environment variables, generating temporary files, etc., without complicating the command.
You can add all kinds of things to the scripts property that help you do your job. For example, here's what Vite recommends in the template:
json
Copy to Clipboard
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
},

Summary
This brings us to the end of our tour of package managers. Our next move is to build up a sample toolchain, putting all that we've learnt so far into practice.
See also
npm scripts reference
package.json reference
scripts
How npm handles the "scripts" field
Select CLI Version:
Description
The "scripts" property of your package.json file supports a number of built-in scripts and their preset life cycle events as well as arbitrary scripts. These all can be executed by running npm run-script <stage> or npm run <stage> for short. Pre and post commands with matching names will be run for those as well (e.g. premyscript, myscript, postmyscript). Scripts from dependencies can be run with npm explore <pkg> -- npm run <stage>.
Pre & Post Scripts
To create "pre" or "post" scripts for any scripts defined in the "scripts" section of the package.json, simply create another script with a matching name and add "pre" or "post" to the beginning of them.
{
 "scripts": {
   "precompress": "{{ executes BEFORE the `compress` script }}",
   "compress": "{{ run command to compress files }}",
   "postcompress": "{{ executes AFTER `compress` script }}"
 }
}
In this example npm run compress would execute these scripts as described.
Life Cycle Scripts
There are some special life cycle scripts that happen only in certain situations. These scripts happen in addition to the pre<event>, post<event>, and <event> scripts.
prepare, prepublish, prepublishOnly, prepack, postpack, dependencies
prepare (since npm@4.0.0)
Runs any time before the package is packed, i.e. during npm publish and npm pack
Runs BEFORE the package is packed
Runs BEFORE the package is published
Runs on local npm install without any arguments
Run AFTER prepublish, but BEFORE prepublishOnly
NOTE: If a package being installed through git contains a prepare script, its dependencies and devDependencies will be installed, and the prepare script will be run, before the package is packaged and installed.
As of npm@7 these scripts run in the background. To see the output, run with: --foreground-scripts.
prepublish (DEPRECATED)
Does not run during npm publish, but does run during npm ci and npm install. See below for more info.
prepublishOnly
Runs BEFORE the package is prepared and packed, ONLY on npm publish.
prepack
Runs BEFORE a tarball is packed (on "npm pack", "npm publish", and when installing a git dependencies).
NOTE: "npm run pack" is NOT the same as "npm pack". "npm run pack" is an arbitrary user defined script name, where as, "npm pack" is a CLI defined command.
postpack
Runs AFTER the tarball has been generated but before it is moved to its final destination (if at all, publish does not save the tarball locally)
dependencies
Runs AFTER any operations that modify the node_modules directory IF changes occurred.
Does NOT run in global mode
Prepare and Prepublish
Deprecation Note: prepublish
Since npm@1.1.71, the npm CLI has run the prepublish script for both npm publish and npm install, because it's a convenient way to prepare a package for use (some common use cases are described in the section below). It has also turned out to be, in practice, very confusing. As of npm@4.0.0, a new event has been introduced, prepare, that preserves this existing behavior. A new event, prepublishOnly has been added as a transitional strategy to allow users to avoid the confusing behavior of existing npm versions and only run on npm publish (for instance, running the tests one last time to ensure they're in good shape).
See https://github.com/npm/npm/issues/10074 for a much lengthier justification, with further reading, for this change.
Use Cases
If you need to perform operations on your package before it is used, in a way that is not dependent on the operating system or architecture of the target system, use a prepublish script. This includes tasks such as:
Compiling CoffeeScript source code into JavaScript.
Creating minified versions of JavaScript source code.
Fetching remote resources that your package will use.
The advantage of doing these things at prepublish time is that they can be done once, in a single place, thus reducing complexity and variability. Additionally, this means that:
You can depend on coffee-script as a devDependency, and thus your users don't need to have it installed.
You don't need to include minifiers in your package, reducing the size for your users.
You don't need to rely on your users having curl or wget or other system tools on the target machines.
Dependencies
The dependencies script is run any time an npm command causes changes to the node_modules directory. It is run AFTER the changes have been applied and the package.json and package-lock.json files have been updated.
Life Cycle Operation Order
npm cache add
prepare
npm ci
preinstall
install
postinstall
prepublish
preprepare
prepare
postprepare
These all run after the actual installation of modules into node_modules, in order, with no internal actions happening in between
npm diff
prepare
npm install
These also run when you run npm install -g <pkg-name>
preinstall
install
postinstall
prepublish
preprepare
prepare
postprepare
If there is a binding.gyp file in the root of your package and you haven't defined your own install or preinstall scripts, npm will default the install command to compile using node-gyp via node-gyp rebuild
These are run from the scripts of <pkg-name>
npm pack
prepack
prepare
postpack
npm publish
prepublishOnly
prepack
prepare
postpack
publish
postpublish
prepare will not run during --dry-run
npm rebuild
preinstall
install
postinstall
prepare
prepare is only run if the current directory is a symlink (e.g. with linked packages)
npm restart
If there is a restart script defined, these events are run, otherwise stop and start are both run if present, including their pre and post iterations)
prerestart
restart
postrestart
npm run <user defined>
pre<user-defined>
<user-defined>
post<user-defined>
npm start
prestart
start
poststart
If there is a server.js file in the root of your package, then npm will default the start command to node server.js. prestart and poststart will still run in this case.
npm stop
prestop
stop
poststop
npm test
pretest
test
posttest
npm version
preversion
version
postversion
A Note on a lack of npm uninstall scripts
While npm v6 had uninstall lifecycle scripts, npm v7 does not. Removal of a package can happen for a wide variety of reasons, and there's no clear way to currently give the script enough context to be useful.
Reasons for a package removal include:
a user directly uninstalled this package
a user uninstalled a dependant package and so this dependency is being uninstalled
a user uninstalled a dependant package but another package also depends on this version
this version has been merged as a duplicate with another version
etc.
Due to the lack of necessary context, uninstall lifecycle scripts are not implemented and will not function.
User
When npm is run as root, scripts are always run with the effective uid and gid of the working directory owner.
Environment
Package scripts run in an environment where many pieces of information are made available regarding the setup of npm and the current state of the process.
path
If you depend on modules that define executable scripts, like test suites, then those executables will be added to the PATH for executing the scripts. So, if your package.json has this:
{
 "name": "foo",
 "dependencies": {
   "bar": "0.1.x"
 },
 "scripts": {
   "start": "bar ./test"
 }
}
then you could run npm start to execute the bar script, which is exported into the node_modules/.bin directory on npm install.
package.json vars
The package.json fields are tacked onto the npm_package_ prefix. So, for instance, if you had {"name":"foo", "version":"1.2.5"} in your package.json file, then your package scripts would have the npm_package_name environment variable set to "foo", and the npm_package_version set to "1.2.5". You can access these variables in your code with process.env.npm_package_name and process.env.npm_package_version, and so on for other fields.
See package.json for more on package configs.
current lifecycle event
Lastly, the npm_lifecycle_event environment variable is set to whichever stage of the cycle is being executed. So, you could have a single script used for different parts of the process which switches based on what's currently happening.
Objects are flattened following this format, so if you had {"scripts":{"install":"foo.js"}} in your package.json, then you'd see this in the script:
process.env.npm_package_scripts_install === "foo.js"
Examples
For example, if your package.json contains this:
{
 "scripts": {
   "install": "scripts/install.js",
   "postinstall": "scripts/install.js",
   "uninstall": "scripts/uninstall.js"
 }
}
then scripts/install.js will be called for the install and post-install stages of the lifecycle, and scripts/uninstall.js will be called when the package is uninstalled. Since scripts/install.js is running for two different phases, it would be wise in this case to look at the npm_lifecycle_event environment variable.
If you want to run a make command, you can do so. This works just fine:
{
 "scripts": {
   "preinstall": "./configure",
   "install": "make && make install",
   "test": "make test"
 }
}
Exiting
Scripts are run by passing the line as a script argument to sh.
If the script exits with a code other than 0, then this will abort the process.
Note that these script files don't have to be Node.js or even JavaScript programs. They just have to be some kind of executable file.
Best Practices
Don't exit with a non-zero error code unless you really mean it. Except for uninstall scripts, this will cause the npm action to fail, and potentially be rolled back. If the failure is minor or only will prevent some optional features, then it's better to just print a warning and exit successfully.
Try not to use scripts to do what npm can do for you. Read through package.json to see all the things that you can specify and enable by simply describing your package appropriately. In general, this will lead to a more robust and consistent state.
Inspect the env to determine where to put things. For instance, if the npm_config_binroot environment variable is set to /home/user/bin, then don't try to install executables into /usr/local/bin. The user probably set it up that way for a reason.
Don't prefix your script commands with "sudo". If root permissions are required for some reason, then it'll fail with that error, and the user will sudo the npm command in question.
Don't use install. Use a .gyp file for compilation, and prepare for anything else. You should almost never have to explicitly set a preinstall or install script. If you are doing this, please consider if there is another option. The only valid use of install or preinstall scripts is for compilation which must be done on the target architecture.
Scripts are run from the root of the package folder, regardless of what the current working directory is when npm is invoked. If you want your script to use different behavior based on what subdirectory you're in, you can use the INIT_CWD environment variable, which holds the full path you were in when you ran npm run.


package.json
Specifics of npm's package.json handling
Select CLI Version:
Description
This document is all you need to know about what's required in your package.json file. It must be actual JSON, not just a JavaScript object literal.
A lot of the behavior described in this document is affected by the config settings described in config.
name
If you plan to publish your package, the most important things in your package.json are the name and version fields as they will be required. The name and version together form an identifier that is assumed to be completely unique. If you don't plan to publish your package, the name and version fields are optional. The name field contains your package name.
Some rules:
The name must be less than or equal to 214 characters. This includes the scope for scoped packages.
The names of scoped packages can begin with a dot or an underscore. This is not permitted without a scope.
New packages must not have uppercase letters in the name.
The name ends up being part of a URL, an argument on the command line, and a folder name. Therefore, the name can't contain any non-URL-safe characters.
Some tips:
Don't use the same name as a core Node module.
Don't put "js" or "node" in the name. It's assumed that it's js, since you're writing a package.json file, and you can specify the engine using the "engines" field. (See below.)
The name will probably be passed as an argument to require(), so it should be something short, but also reasonably descriptive.
You may want to check the npm registry to see if there's something by that name already, before you get too attached to it. https://www.npmjs.com/
A name can be optionally prefixed by a scope, e.g. @myorg/mypackage. See scope for more detail.
version
Changes to the package should come along with changes to the version. You can show developers how much they need to adjust on a new update by using semantic versioning
Version must be parseable by node-semver, which is bundled with npm as a dependency. (npm install semver to use it yourself.)
description
Put a description in it. It's a string. This helps people discover your package, as it's listed in npm search.
keywords
Put keywords in it. It's an array of strings. This helps people discover your package as it's listed in npm search.
homepage
The url to the project homepage.
Example:
"homepage": "https://github.com/owner/project#readme"
bugs
The url to your project's issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package.
It should look like this:
{
 "url": "https://github.com/owner/project/issues",
 "email": "project@hostname.com"
}
You can specify either one or both values. If you want to provide only a url, you can specify the value for "bugs" as a simple string instead of an object.
If a url is provided, it will be used by the npm bugs command.
license
You should specify a license for your package so that people know how they are permitted to use it, and any restrictions you're placing on it.
If you're using a common license such as BSD-2-Clause or MIT, add a current SPDX license identifier for the license you're using, like this:
{
 "license": "BSD-3-Clause"
}
You can check the full list of SPDX license IDs. Ideally you should pick one that is OSI approved.
If your package is licensed under multiple common licenses, use an SPDX license expression syntax version 2.0 string, like this:
{
 "license": "(ISC OR GPL-3.0)"
}
If you are using a license that hasn't been assigned an SPDX identifier, or if you are using a custom license, use a string value like this one:
{
 "license": "SEE LICENSE IN <filename>"
}
Then include a file named <filename> at the top level of the package.
Some old packages used license objects or a "licenses" property containing an array of license objects:
// Not valid metadata
{
 "license" : {
   "type" : "ISC",
   "url" : "https://opensource.org/licenses/ISC"
 }
}


// Not valid metadata
{
 "licenses" : [
   {
     "type": "MIT",
     "url": "https://www.opensource.org/licenses/mit-license.php"
   },
   {
     "type": "Apache-2.0",
     "url": "https://opensource.org/licenses/apache2.0.php"
   }
 ]
}
Those styles are now deprecated. Instead, use SPDX expressions, like this:
{
 "license": "ISC"
}
{
 "license": "(MIT OR Apache-2.0)"
}
Finally, if you do not wish to grant others the right to use a private or unpublished package under any terms:
{
 "license": "UNLICENSED"
}
Consider also setting "private": true to prevent accidental publication.
people fields: author, contributors
The "author" is one person. "contributors" is an array of people. A "person" is an object with a "name" field and optionally "url" and "email", like this:
{
 "name": "Barney Rubble",
 "email": "b@rubble.com",
 "url": "http://barnyrubble.tumblr.com/"
}
Or you can shorten that all into a single string, and npm will parse it for you:
{
 "author": "Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)"
}
Both email and url are optional either way.
npm also sets a top-level "maintainers" field with your npm user info.
funding
You can specify an object containing a URL that provides up-to-date information about ways to help fund development of your package, or a string URL, or an array of these:
{
 "funding": {
   "type": "individual",
   "url": "http://example.com/donate"
 },


 "funding": {
   "type": "patreon",
   "url": "https://www.patreon.com/my-account"
 },


 "funding": "http://example.com/donate",


 "funding": [
   {
     "type": "individual",
     "url": "http://example.com/donate"
   },
   "http://example.com/donateAlso",
   {
     "type": "patreon",
     "url": "https://www.patreon.com/my-account"
   }
 ]
}
Users can use the npm fund subcommand to list the funding URLs of all dependencies of their project, direct and indirect. A shortcut to visit each funding url is also available when providing the project name such as: npm fund <projectname> (when there are multiple URLs, the first one will be visited)
files
The optional files field is an array of file patterns that describes the entries to be included when your package is installed as a dependency. File patterns follow a similar syntax to .gitignore, but reversed: including a file, directory, or glob pattern (*, **/*, and such) will make it so that file is included in the tarball when it's packed. Omitting the field will make it default to ["*"], which means it will include all files.
Some special files and directories are also included or excluded regardless of whether they exist in the files array (see below).
You can also provide a .npmignore file in the root of your package or in subdirectories, which will keep files from being included. At the root of your package it will not override the "files" field, but in subdirectories it will. The .npmignore file works just like a .gitignore. If there is a .gitignore file, and .npmignore is missing, .gitignore's contents will be used instead.
Files included with the "package.json#files" field cannot be excluded through .npmignore or .gitignore.
Certain files are always included, regardless of settings:
package.json
README
LICENSE / LICENCE
The file in the "main" field
README & LICENSE can have any case and extension.
Conversely, some files are always ignored:
.git
CVS
.svn
.hg
.lock-wscript
.wafpickle-N
.*.swp
.DS_Store
._*
npm-debug.log
.npmrc
node_modules
config.gypi
*.orig
package-lock.json (use npm-shrinkwrap.json if you wish it to be published)
main
The main field is a module ID that is the primary entry point to your program. That is, if your package is named foo, and a user installs it, and then does require("foo"), then your main module's exports object will be returned.
This should be a module relative to the root of your package folder.
For most modules, it makes the most sense to have a main script and often not much else.
If main is not set it defaults to index.js in the package's root folder.
browser
If your module is meant to be used client-side the browser field should be used instead of the main field. This is helpful to hint users that it might rely on primitives that aren't available in Node.js modules. (e.g. window)
bin
A lot of packages have one or more executable files that they'd like to install into the PATH. npm makes this pretty easy (in fact, it uses this feature to install the "npm" executable.)
To use this, supply a bin field in your package.json which is a map of command name to local file name. When this package is installed globally, that file will be linked where global bins go so it is available to run by name. When this package is installed as a dependency in another package, the file will be linked where it will be available to that package either directly by npm exec or by name in other scripts when invoking them via npm run-script.
For example, myapp could have this:
{
 "bin": {
   "myapp": "./cli.js"
 }
}
So, when you install myapp, it'll create a symlink from the cli.js script to /usr/local/bin/myapp.
If you have a single executable, and its name should be the name of the package, then you can just supply it as a string. For example:
{
 "name": "my-program",
 "version": "1.2.5",
 "bin": "./path/to/program"
}
would be the same as this:
{
 "name": "my-program",
 "version": "1.2.5",
 "bin": {
   "my-program": "./path/to/program"
 }
}
Please make sure that your file(s) referenced in bin starts with #!/usr/bin/env node, otherwise the scripts are started without the node executable!
Note that you can also set the executable files using directories.bin.
See folders for more info on executables.
man
Specify either a single file or an array of filenames to put in place for the man program to find.
If only a single file is provided, then it's installed such that it is the result from man <pkgname>, regardless of its actual filename. For example:
{
 "name": "foo",
 "version": "1.2.3",
 "description": "A packaged foo fooer for fooing foos",
 "main": "foo.js",
 "man": "./man/doc.1"
}
would link the ./man/doc.1 file in such that it is the target for man foo
If the filename doesn't start with the package name, then it's prefixed. So, this:
{
 "name": "foo",
 "version": "1.2.3",
 "description": "A packaged foo fooer for fooing foos",
 "main": "foo.js",
 "man": ["./man/foo.1", "./man/bar.1"]
}
will create files to do man foo and man foo-bar.
Man files must end with a number, and optionally a .gz suffix if they are compressed. The number dictates which man section the file is installed into.
{
 "name": "foo",
 "version": "1.2.3",
 "description": "A packaged foo fooer for fooing foos",
 "main": "foo.js",
 "man": ["./man/foo.1", "./man/foo.2"]
}
will create entries for man foo and man 2 foo
directories
The CommonJS Packages spec details a few ways that you can indicate the structure of your package using a directories object. If you look at npm's package.json, you'll see that it has directories for doc, lib, and man.
In the future, this information may be used in other creative ways.
directories.bin
If you specify a bin directory in directories.bin, all the files in that folder will be added.
Because of the way the bin directive works, specifying both a bin path and setting directories.bin is an error. If you want to specify individual files, use bin, and for all the files in an existing bin directory, use directories.bin.
directories.man
A folder that is full of man pages. Sugar to generate a "man" array by walking the folder.
repository
Specify the place where your code lives. This is helpful for people who want to contribute. If the git repo is on GitHub, then the npm docs command will be able to find you.
Do it like this:
{
 "repository": {
   "type": "git",
   "url": "https://github.com/npm/cli.git"
 }
}
The URL should be a publicly available (perhaps read-only) url that can be handed directly to a VCS program without any modification. It should not be a url to an html project page that you put in your browser. It's for computers.
For GitHub, GitHub gist, Bitbucket, or GitLab repositories you can use the same shortcut syntax you use for npm install:
{
 "repository": "npm/npm",


 "repository": "github:user/repo",


 "repository": "gist:11081aaa281",


 "repository": "bitbucket:user/repo",


 "repository": "gitlab:user/repo"
}
If the package.json for your package is not in the root directory (for example if it is part of a monorepo), you can specify the directory in which it lives:
{
 "repository": {
   "type": "git",
   "url": "https://github.com/facebook/react.git",
   "directory": "packages/react-dom"
 }
}
scripts
The "scripts" property is a dictionary containing script commands that are run at various times in the lifecycle of your package. The key is the lifecycle event, and the value is the command to run at that point.
See scripts to find out more about writing package scripts.
config
A "config" object can be used to set configuration parameters used in package scripts that persist across upgrades. For instance, if a package had the following:
{
 "name": "foo",
 "config": {
   "port": "8080"
 }
}
It could also have a "start" command that referenced the npm_package_config_port environment variable.
dependencies
Dependencies are specified in a simple object that maps a package name to a version range. The version range is a string which has one or more space-separated descriptors. Dependencies can also be identified with a tarball or git URL.
Please do not put test harnesses or transpilers or other "development" time tools in your dependencies object. See devDependencies, below.
See semver for more details about specifying version ranges.
version Must match version exactly
>version Must be greater than version
>=version etc
<version
<=version
~version "Approximately equivalent to version" See semver
^version "Compatible with version" See semver
1.2.x 1.2.0, 1.2.1, etc., but not 1.3.0
http://... See 'URLs as Dependencies' below
* Matches any version
"" (just an empty string) Same as *
version1 - version2 Same as >=version1 <=version2.
range1 || range2 Passes if either range1 or range2 are satisfied.
git... See 'Git URLs as Dependencies' below
user/repo See 'GitHub URLs' below
tag A specific version tagged and published as tag See npm dist-tag
path/path/path See Local Paths below
For example, these are all valid:
{
 "dependencies": {
   "foo": "1.0.0 - 2.9999.9999",
   "bar": ">=1.0.2 <2.1.2",
   "baz": ">1.0.2 <=2.3.4",
   "boo": "2.0.1",
   "qux": "<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0",
   "asd": "http://asdf.com/asdf.tar.gz",
   "til": "~1.2",
   "elf": "~1.2.3",
   "two": "2.x",
   "thr": "3.3.x",
   "lat": "latest",
   "dyl": "file:../dyl"
 }
}
URLs as Dependencies
You may specify a tarball URL in place of a version range.
This tarball will be downloaded and installed locally to your package at install time.
Git URLs as Dependencies
Git urls are of the form:
<protocol>://[<user>[:<password>]@]<hostname>[:<port>][:][/]<path>[#<commit-ish> | #semver:<semver>]
<protocol> is one of git, git+ssh, git+http, git+https, or git+file.
If #<commit-ish> is provided, it will be used to clone exactly that commit. If the commit-ish has the format #semver:<semver>, <semver> can be any valid semver range or exact version, and npm will look for any tags or refs matching that range in the remote repository, much as it would for a registry dependency. If neither #<commit-ish> or #semver:<semver> is specified, then the default branch is used.
Examples:
git+ssh://git@github.com:npm/cli.git#v1.0.27
git+ssh://git@github.com:npm/cli#semver:^5.0
git+https://isaacs@github.com/npm/cli.git
git://github.com/npm/cli.git#v1.0.27
When installing from a git repository, the presence of certain fields in the package.json will cause npm to believe it needs to perform a build. To do so your repository will be cloned into a temporary directory, all of its deps installed, relevant scripts run, and the resulting directory packed and installed.
This flow will occur if your git dependency uses workspaces, or if any of the following scripts are present:
build
prepare
prepack
preinstall
install
postinstall
If your git repository includes pre-built artifacts, you will likely want to make sure that none of the above scripts are defined, or your dependency will be rebuilt for every installation.
GitHub URLs
As of version 1.1.65, you can refer to GitHub urls as just "foo": "user/foo-project". Just as with git URLs, a commit-ish suffix can be included. For example:
{
 "name": "foo",
 "version": "0.0.0",
 "dependencies": {
   "express": "expressjs/express",
   "mocha": "mochajs/mocha#4727d357ea",
   "module": "user/repo#feature\/branch"
 }
}
Local Paths
As of version 2.0.0 you can provide a path to a local directory that contains a package. Local paths can be saved using npm install -S or npm install --save, using any of these forms:
../foo/bar
~/foo/bar
./foo/bar
/foo/bar
in which case they will be normalized to a relative path and added to your package.json. For example:
{
 "name": "baz",
 "dependencies": {
   "bar": "file:../foo/bar"
 }
}
This feature is helpful for local offline development and creating tests that require npm installing where you don't want to hit an external server, but should not be used when publishing packages to the public registry.
note: Packages linked by local path will not have their own dependencies installed when npm install is ran in this case. You must run npm install from inside the local path itself.
devDependencies
If someone is planning on downloading and using your module in their program, then they probably don't want or need to download and build the external test or documentation framework that you use.
In this case, it's best to map these additional items in a devDependencies object.
These things will be installed when doing npm link or npm install from the root of a package, and can be managed like any other npm configuration param. See config for more on the topic.
For build steps that are not platform-specific, such as compiling CoffeeScript or other languages to JavaScript, use the prepare script to do this, and make the required package a devDependency.
For example:
{
 "name": "ethopia-waza",
 "description": "a delightfully fruity coffee varietal",
 "version": "1.2.3",
 "devDependencies": {
   "coffee-script": "~1.6.3"
 },
 "scripts": {
   "prepare": "coffee -o lib/ -c src/waza.coffee"
 },
 "main": "lib/waza.js"
}
The prepare script will be run before publishing, so that users can consume the functionality without requiring them to compile it themselves. In dev mode (ie, locally running npm install), it'll run this script as well, so that you can test it easily.
peerDependencies
In some cases, you want to express the compatibility of your package with a host tool or library, while not necessarily doing a require of this host. This is usually referred to as a plugin. Notably, your module may be exposing a specific interface, expected and specified by the host documentation.
For example:
{
 "name": "tea-latte",
 "version": "1.3.5",
 "peerDependencies": {
   "tea": "2.x"
 }
}
This ensures your package tea-latte can be installed along with the second major version of the host package tea only. npm install tea-latte could possibly yield the following dependency graph:
├── tea-latte@1.3.5
└── tea@2.2.0
In npm versions 3 through 6, peerDependencies were not automatically installed, and would raise a warning if an invalid version of the peer dependency was found in the tree. As of npm v7, peerDependencies are installed by default.
Trying to install another plugin with a conflicting requirement may cause an error if the tree cannot be resolved correctly. For this reason, make sure your plugin requirement is as broad as possible, and not to lock it down to specific patch versions.
Assuming the host complies with semver, only changes in the host package's major version will break your plugin. Thus, if you've worked with every 1.x version of the host package, use "^1.0" or "1.x" to express this. If you depend on features introduced in 1.5.2, use "^1.5.2".
peerDependenciesMeta
When a user installs your package, npm will emit warnings if packages specified in peerDependencies are not already installed. The peerDependenciesMeta field serves to provide npm more information on how your peer dependencies are to be used. Specifically, it allows peer dependencies to be marked as optional.
For example:
{
 "name": "tea-latte",
 "version": "1.3.5",
 "peerDependencies": {
   "tea": "2.x",
   "soy-milk": "1.2"
 },
 "peerDependenciesMeta": {
   "soy-milk": {
     "optional": true
   }
 }
}
Marking a peer dependency as optional ensures npm will not emit a warning if the soy-milk package is not installed on the host. This allows you to integrate and interact with a variety of host packages without requiring all of them to be installed.
bundleDependencies
This defines an array of package names that will be bundled when publishing the package.
In cases where you need to preserve npm packages locally or have them available through a single file download, you can bundle the packages in a tarball file by specifying the package names in the bundleDependencies array and executing npm pack.
For example:
If we define a package.json like this:
{
 "name": "awesome-web-framework",
 "version": "1.0.0",
 "bundleDependencies": ["renderized", "super-streams"]
}
we can obtain awesome-web-framework-1.0.0.tgz file by running npm pack. This file contains the dependencies renderized and super-streams which can be installed in a new project by executing npm install awesome-web-framework-1.0.0.tgz. Note that the package names do not include any versions, as that information is specified in dependencies.
If this is spelled "bundledDependencies", then that is also honored.
Alternatively, "bundleDependencies" can be defined as a boolean value. A value of true will bundle all dependencies, a value of false will bundle none.
optionalDependencies
If a dependency can be used, but you would like npm to proceed if it cannot be found or fails to install, then you may put it in the optionalDependencies object. This is a map of package name to version or url, just like the dependencies object. The difference is that build failures do not cause installation to fail. Running npm install --omit=optional will prevent these dependencies from being installed.
It is still your program's responsibility to handle the lack of the dependency. For example, something like this:
try {
 var foo = require("foo");
 var fooVersion = require("foo/package.json").version;
} catch (er) {
 foo = null;
}
if (notGoodFooVersion(fooVersion)) {
 foo = null;
}


// .. then later in your program ..


if (foo) {
 foo.doFooThings();
}
Entries in optionalDependencies will override entries of the same name in dependencies, so it's usually best to only put in one place.
overrides
If you need to make specific changes to dependencies of your dependencies, for example replacing the version of a dependency with a known security issue, replacing an existing dependency with a fork, or making sure that the same version of a package is used everywhere, then you may add an override.
Overrides provide a way to replace a package in your dependency tree with another version, or another package entirely. These changes can be scoped as specific or as vague as desired.
To make sure the package foo is always installed as version 1.0.0 no matter what version your dependencies rely on:
{
 "overrides": {
   "foo": "1.0.0"
 }
}
The above is a short hand notation, the full object form can be used to allow overriding a package itself as well as a child of the package. This will cause foo to always be 1.0.0 while also making bar at any depth beyond foo also 1.0.0:
{
 "overrides": {
   "foo": {
     ".": "1.0.0",
     "bar": "1.0.0"
   }
 }
}
To only override foo to be 1.0.0 when it's a child (or grandchild, or great grandchild, etc) of the package bar:
{
 "overrides": {
   "bar": {
     "foo": "1.0.0"
   }
 }
}
Keys can be nested to any arbitrary length. To override foo only when it's a child of bar and only when bar is a child of baz:
{
 "overrides": {
   "baz": {
     "bar": {
       "foo": "1.0.0"
     }
   }
 }
}
The key of an override can also include a version, or range of versions. To override foo to 1.0.0, but only when it's a child of bar@2.0.0:
{
 "overrides": {
   "bar@2.0.0": {
     "foo": "1.0.0"
   }
 }
}
You may not set an override for a package that you directly depend on unless both the dependency and the override itself share the exact same spec. To make this limitation easier to deal with, overrides may also be defined as a reference to a spec for a direct dependency by prefixing the name of the package you wish the version to match with a $.
{
 "dependencies": {
   "foo": "^1.0.0"
 },
 "overrides": {
   // BAD, will throw an EOVERRIDE error
   // "foo": "^2.0.0"
   // GOOD, specs match so override is allowed
   // "foo": "^1.0.0"
   // BEST, the override is defined as a reference to the dependency
   "foo": "$foo",
   // the referenced package does not need to match the overridden one
   "bar": "$foo"
 }
}
engines
You can specify the version of node that your stuff works on:
{
 "engines": {
   "node": ">=0.10.3 <15"
 }
}
And, like with dependencies, if you don't specify the version (or if you specify "*" as the version), then any version of node will do.
You can also use the "engines" field to specify which versions of npm are capable of properly installing your program. For example:
{
 "engines": {
   "npm": "~1.0.20"
 }
}
Unless the user has set the engine-strict config flag, this field is advisory only and will only produce warnings when your package is installed as a dependency.
os
You can specify which operating systems your module will run on:
{
 "os": ["darwin", "linux"]
}
You can also block instead of allowing operating systems, just prepend the blocked os with a '!':
{
 "os": ["!win32"]
}
The host operating system is determined by process.platform
It is allowed to both block and allow an item, although there isn't any good reason to do this.
cpu
If your code only runs on certain cpu architectures, you can specify which ones.
{
 "cpu": ["x64", "ia32"]
}
Like the os option, you can also block architectures:
{
 "cpu": ["!arm", "!mips"]
}
The host architecture is determined by process.arch
private
If you set "private": true in your package.json, then npm will refuse to publish it.
This is a way to prevent accidental publication of private repositories. If you would like to ensure that a given package is only ever published to a specific registry (for example, an internal registry), then use the publishConfig dictionary described below to override the registry config param at publish-time.
publishConfig
This is a set of config values that will be used at publish-time. It's especially handy if you want to set the tag, registry or access, so that you can ensure that a given package is not tagged with "latest", published to the global public registry or that a scoped module is private by default.
See config to see the list of config options that can be overridden.
workspaces
The optional workspaces field is an array of file patterns that describes locations within the local file system that the install client should look up to find each workspace that needs to be symlinked to the top level node_modules folder.
It can describe either the direct paths of the folders to be used as workspaces or it can define globs that will resolve to these same folders.
In the following example, all folders located inside the folder ./packages will be treated as workspaces as long as they have valid package.json files inside them:
{
 "name": "workspace-example",
 "workspaces": ["./packages/*"]
}
See workspaces for more examples.
DEFAULT VALUES
npm will default some values based on package contents.
"scripts": {"start": "node server.js"}
If there is a server.js file in the root of your package, then npm will default the start command to node server.js.
"scripts":{"install": "node-gyp rebuild"}
If there is a binding.gyp file in the root of your package and you have not defined an install or preinstall script, npm will default the install command to compile using node-gyp.
"contributors": [...]
If there is an AUTHORS file in the root of your package, npm will treat each line as a Name <email> (url) format, where email and url are optional. Lines which start with a # or are blank, will be ignored.
Computers are supposed to make our lives easier, not more difficult. As usability-conscious designers, we can make our users’ lives easier by thinking about the way people interact with our websites, providing clear direction, and then putting the burden of sorting out the details in the hands of the computers—not the users.
Article Continues Below
72 Comments
Become a patron
It’s that last part that we’re going to focus on here. We’ve all heard and read about big usability mistakes time and time again: “Don’t use images or Flash for navigation,” “Don’t use JavaScript for links,” and I certainly hope we’re all applying those lessons in our work. It’s often the smallest usability quirks, however, that create the biggest annoyances for users, especially when it comes to HTML forms. Follow these guidelines, and you’ll be off to a good start.
Use the right field for the task
With so many form elements to choose from, each with distinct advantages and disadvantages, it can be difficult to decide which elements to use in a given situation. Use radio buttons, checkboxes, and select boxes appropriately: for radio buttons or checkboxes, use the fieldset and legend tags to group the elements logically under an obvious heading. This grouping keeps the form manageable to users, as it can be broken down into smaller pieces in their minds.
Jakob Nielsen provides these guidelines for use of checkboxes versus radio buttons:
Radio buttons are used when there is a list of two or more options that are mutually exclusive and the user must select exactly one choice. In other words, clicking a non-selected radio button will deselect whatever other button was previously selected in the list.
Checkboxes are used when there are lists of options and the user may select any number of choices, including zero, one, or several. In other words, each checkbox is independent of all other checkboxes in the list, so checking one box doesn’t uncheck the others.
A stand-alone checkbox is used for a single option that the user can turn on or off.
Source: “Checkboxes vs. Radio Buttons.”
For fields in which a single selection is required and there are a large number of possible options, consider using a drop-down select box to conserve screen real estate. The barrier between what makes sense as radio buttons and select boxes is somewhat of a gray area and will depend on context. If you wind up with five or more radio buttons, it may be time to move up to a select box.
If the field allows for multiple selections, try your best to avoid using the so-called “multi-select” box. This form element is at best confusing to users and at worst, it makes the form useless to those who do not immediately understand its functionality. If the number of options is so great that it becomes a giant blur represented as checkboxes, consider consolidating some of your options or categorizing them hierarchically to make them easier to understand.
Give them room to type
Equally important to making the right decision on the field type is specifying the right field length. Just because your name is Joe Tod doesn’t mean other users won’t need more space to enter their names. Provide at least 20 characters for each of the first and last name fields. Additionally, don’t make the physical size of the input box cover less area than the expected entry. For text areas, make sure to give the user sufficient room to enter and read their text. Very tall, very thin columns are as difficult to read as a very wide, very short horizontal text area. The exact values will vary depending on their use but we can establish some minimums of 50 characters wide by 10 lines tall to ensure readability.
Shorten your forms and question “mandatory” fields
To make your form as concise as possible, I recommend a two-step evaluation of every element of the form. To begin, ask yourself the following questions about each form element:
Is this a piece of information that is valuable to us?
Is this a piece of information that is so valuable that it’s worth denying users access to (whatever lies beyond the form) if they do not choose to provide it?
One of the most obvious examples of a form element that fails the first test is the salutation. It usually provides us no real benefit to collect this information, so why are we making a user give it to us? Don’t waste users’ time by asking them to provide useless information.
The second test (“should we require this field?”) is a bit more subjective. One example is the telephone number. There are many instances in which a telephone number would be nice to have. However, it’s usually not required to continue the transaction. Put the choice back into the users’ hands.
Mark mandatory fields clearly
Some fields must be filled in to complete the transaction: if you’re selling a physical good, you’ll obviously need a shipping address. As with error messaging, give users visual cues as to which fields are required. Many times, form authors use bold or italic text to signify which fields are required and expect the user to make this association. There are several more explicit options which you can use to draw attention to required form elements. You can use an asterisk, “required” in parentheses following the field, or we can divide the form into two sections: required and optional information. In any case, if you are using any type of symbol or highlighting to denote fields which are required, you need to provide an easily findable legend which notifies the user of the symbol’s meaning.
I advise against using the color red to denote required fields, because red most often indicates an error or warning. As I’ll soon discuss, you should provide strong visual cues to indicate errors, so pick a color that will not be confused with error messages.
Provide descriptive labels for all of your fields
What good is a form field without knowing what you are supposed to enter into the field? Employ the label tag to ensure accessibility is maintained for all users. Also, make sure your labels are descriptive enough that users do not question what is expected in that field. Field names should be clear and concise. If additional information would be helpful, XHTML 1.1 provides the caption tag to add a descriptive caption and provide proper accessibility. For the less adventurous, you can always create small caption text using traditional XHTML 1.0 markup and CSS.
Let the computer, not the user, handle information formatting
Few things confuse users as often as requiring that users provide information in a specific format. Format requirements for information like telephone number fields are particularly common. There are many ways these numbers can be represented:
(800) 555-1212
800-555-1212
800.555.1212
800 555 1212
Ultimately, the format we likely need is the one that only contains numbers:
8005551212
There are three ways to handle this. The first method tells the user that a specific format of input is required and returns them to the form with an error message if they fail to heed this instruction.
The second method is to split the telephone number input into three fields. This method presents the user with two possible striking usability hurdles to overcome. First, the user might try to type the numbers in all at once and get stuck because they’ve just typed their entire telephone number into a box which only accepts three digits. The “ingenious” solution to this problem was to use JavaScript to automatically shift the focus to the next field when the digit limit is achieved. Has anyone else here made a typo in one of these types of forms and gone through the ridiculous process of trying to return focus to what Javascript sees as a completed field? Raise your hands; don’t be shy! Yes, I see all of you.
Be reasonable; are we so afraid of regular expressions that we can’t strip extraneous characters from a single input field? Let the users type their telephone numbers in whatever they please. We can use a little quick programming to filter out what we don’t need.
Use informative error messages
When I began work on this article, I spoke with my mother, a reasonably “average” home user, about the topic. The issue of form errors was the first thing she spoke, or rather, ranted about. When she tried to order a Christmas present from a website recently, she filled out the form and clicked the “order” button. She was then returned to the form with the words “Credit Card Error” in bold, red text across the top of her screen. Confused, she searched through the form to find any indication of where the problem had occurred. Finding none, she searched again to find the credit card input field. She checked the numbers and the expiration date. She even checked the spelling of her name, but each time she submitted the form, the same error message was displayed.
As it turned out, the problem was that the merchant’s credit card processing system was down. Nothing she could have done with the form would have made any difference. Returning a user to this situation just makes them feel ignorant, and I suspect we can all agree that insulting users is not in our best interests.
There are several steps we can take to better handle errors in HTML forms. First, and most importantly, we can provide more informative messages. Replace cryptic messages such as “Credit Card Error,” with context-sensitive messages:
“There was an error in our credit-card processing system. Your card has not been charged. Please try again later or contact us directly at…”
“There was an error processing your credit card; we were unable to verify your card number. Please check your name, credit card number, and card expiration date for correctness. Remember, these must match the card exactly.”
These error messages are complete and tell the user what has happened. These messages also direct users towards possible resolutions rather than just telling them what went wrong and expecting them to devise their own solution.
The next step we can take to avoid confusing errors is to provide some visual cues as to where the problem lies; don’t leave your users to hunt down the problem areas themselves. With a little CSS, you can modify the original form in a variety of ways so that the user can easily identify the elements which need to be corrected. You can also use CSS to hide the fields that are already filled in correctly and only display those which need to be corrected. We can do this for groups of fields (such as the information required for credit-card validation) by using the fieldset tag.
Don’t return users to an altered form
How many times have you entered your information into a form and clicked the submit button only to find that you left a required element unfilled? If you’re anything like me, I’m guessing it happens more than once in a while. While it might just be the price I pay for skimming the form and trying to get through it as quickly as possible, I shouldn’t be returned to an altered form if I make a mistake.
When I submitted my data, I had checked the box which said I agreed to the terms of service. I had also filled in my password. And, if I recall correctly, I definitely unchecked those boxes that said “Sign my e-mail address up for as many mailing lists as possible.” So why is it that so many times I get a half-completed form back?
This example is really a combination of developer laziness and overzealous marketing techniques. (Though the password un-fill may be a legitimate security precaution.) To the marketing departments out there: remember that marketing is about satisfying customer needs. If a user’s need is to not receive your solicitations, you should respect that need instead of trying to trick people into something they’ve already told you they don’t want. And to developers, make sure you’re populating every form element that the user has already submitted. There’s no reason they should have to re-accept the terms of your agreement or enter their information a second time because of a small typo.
Remember, the more control users have over their experience, the happier they will be using your website.




Introducing a complete toolchain
Previous


Overview: Understanding client-side web development tools


Next


In the final couple of articles in the series, we will solidify your tooling knowledge by walking you through the process of building up a sample case study toolchain. We'll go all the way from setting up a sensible development environment and putting transformation tools in place to actually deploying your app. In this article, we'll introduce the case study, set up our development environment, and set up our code transformation tools.
Prerequisites:
Familiarity with the core HTML, CSS, and JavaScript languages.
Objective:
To solidify what we've learnt so far by working through a complete toolchain case study.

There really are unlimited combinations of tools and ways to use them, what you see in this article and the next is only one way that the featured tools can be used for a project.
Note: It's also worth repeating that not all of these tools need to be run on the command line. Many of today's code editors (such as VS Code) have integration support for a lot of tools via plugins.
Introducing our case study
The toolchain that we are creating in this article will be used to build and deploy a mini-site that displays data about the mdn/content repository, sourcing its data from the GitHub API.
Tools used in our toolchain
In this article we're going to use the following tools and features:
JSX, a React-related set of syntax extensions that allow you to do things like defining component structures inside JavaScript. You won't need to know React to follow this tutorial, but we've included this to give you an idea of how a non-native web language could be integrated into a toolchain.
The latest built-in JavaScript features (at the time of writing), such as import.
Useful development tools such as Prettier for formatting and ESLint for linting.
PostCSS to provide CSS nesting capabilities.
Vite to build and minify our code, and to write a bunch of configuration file content automatically for us.
GitHub to manage our source code control as well as to eventually deploy our site (using GitHub Pages).
You may not be familiar with all the above features and tools or what they are doing, but don't panic — we'll explain each part as we move through this article.
Toolchains and their inherent complexity
As with any chain, the more links you have in your toolchain, the more complex and potentially brittle it is — for example it might be more complex to configure, and easier to break. Conversely, the fewer links, the more resilient the toolchain is likely to be.
All web projects will be different, and you need to consider what parts of your toolchain are necessary and consider each part carefully.
The smallest toolchain is one that has no links at all. You would hand code the HTML, use "vanilla JavaScript" (meaning no frameworks or intermediary languages), and manually upload it all to a server for hosting.
However, more complicated software requirements will likely benefit from the usage of tools to help simplify the development process. In addition, you should include tests before you deploy to your production server to ensure your software works as intended — this already sounds like a necessary toolchain.
For our sample project, we'll be using a toolchain specifically designed to aid our software development and support the technical choices made during the software design phase. We will however be avoiding any superfluous tooling, with the aim of keeping complexity to a minimum.
Checking prerequisites
You should have most of the pieces of software already if you've been following along with the previous chapters. Here's what you should have before proceeding to the real setup steps. They only need to be done once and you don't need to repeat these again for future projects.
Creating a GitHub account
Besides the tools we're going to install that contribute to our toolchain, you will need to create an account with GitHub if you wish to complete the tutorial. However, you can still follow the local development part without it. As mentioned previously, GitHub is a source code repository service that adds community features such as issue tracking, following project releases, and much more. In the next chapter, we will push to a GitHub code repository, which will cause a cascade effect that (should) deploy all the software to a home on the web.
Sign up for GitHub by clicking the Sign Up link on the homepage if you don't already have an account, and follow the instructions.
Installing git
We'll install another software, git, to help with revision control.
It's possible you've heard of "git" before. Git is currently the most popular source code revision control tool available to developers — revision control provides many advantages, such as a way to backup your work in a remote place, and a mechanism to work in a team on the same project without fear of overwriting each other's code.
It might be obvious to some, but it bears repeating: Git is not the same thing as GitHub. Git is the revision control tool, whereas GitHub is an online store for git repositories (plus a number of useful tools for working with them). Note that, although we're using GitHub in this chapter, there are several alternatives including GitLab and Bitbucket, and you could even host your own git repositories.
Using revision control in your projects and including it as part of the toolchain will help manage the evolution of your code. It offers a way to "commit" blocks of work as you progress, along with comments such as "X new feature implemented", or "Bug Z now fixed due to Y changes".
Revision control can also allow you to branch out your project code, creating a separate version, and trying out new functionality on, without those changes affecting your original code.
Finally, it can help you undo changes or revert your code back to a time "when it was working" if a mistake has been introduced somewhere and you are having trouble fixing it — something all developers need to do once in a while!
Git can be downloaded and installed via the git-scm website — download the relevant installer for your system, run it, and follow the on-screen prompts. This is all you need to do for now.
You can interact with git in a number of different ways, from using the command line to issue commands, to using a git GUI app to issue the same commands by pushing buttons, or even from directly inside your code editor, as seen in the Visual Studio Code example below:

Existing project
We'll be building on the project we already started in the previous chapter, so make sure you follow the instructions in Package management to get the project set up first. To recap, here's what you should have:
Node.js and npm installed.
A new project called npm-experiment (or some other name).
Vite installed as a dev dependency.
The plotly.js-dist-min package installed as a dependency.
Some custom scripts defined in package.json.
The index.html and src/main.jsx files created.
As we talked about in Chapter 1, the toolchain will be structured into the following phases:
Development environment: The tools that are most fundamental to running your code. This part is already set up in the previous chapter.
Safety net: Making the software development experience stable and more efficient. We might also refer to this as our development environment.
Transformation: Tooling that allows us to use the latest features of a language (e.g., JavaScript) or another language entirely (e.g., JSX or TypeScript) in our development process, and then transforms our code so that the production version still runs on a wide variety of browsers, modern and older.
Post development: Tooling that comes into play after you are done with the body of development to ensure that your software makes it to the web and continues to run. In this case study we'll look at adding tests to your code, and deploying your app using GitHub Pages so it is available for all the web to see.
Let's start working on these, beginning with our development environment. We will follow the same steps as how a real project would be set up, so in the future, if you are setting up a new project, you can refer back to this chapter and follow the steps again.
Creating a development environment
This part of the toolchain is sometimes seen to be delaying the actual work, and it can be very easy to fall into a "rabbit hole" of tooling where you spend a lot of time trying to get the environment "just right".
But you can look at this in the same way as setting up your physical work environment. The chair needs to be comfortable, and set up in a good position to help with your posture. You need power, Wi-Fi, and USB ports! There might be important decorations or music that help with your mental state — these are all important to do your best work possible, and they should also only need to be set up once, if done properly.
In the same way, setting up your development environment, if done well, needs to be done only once and should be reusable in many future projects. You will probably want to review this part of the toolchain semi-regularly and consider if there are any upgrades or changes you should introduce, but this shouldn't be required too often.
Your toolchain will depend on your own needs, but for this example of a fairly complete toolchain, the tools that will be installed/initialized up front will be:
Library installation tools — for adding dependencies.
Code revision control.
Code tidying tools — for tidying JavaScript, CSS, and HTML.
Code linting tools — for linting our code.
Library installation tools
You have already done this, but for easy reference, here are the commands (run at the root of the npm-experiment directory) to initialize an npm package and install the necessary dependencies:
bash
Copy to Clipboard
npm init
npm install --save-dev vite
npm install plotly.js-dist-min

Code revision control
Enter the following command to start git's source control functionality working on the directory:
bash
Copy to Clipboard
git init

By default, git tracks the changes of all files. However, there are some generated files we don't need to track, as they are not code that we have written and can be regenerated any time. We can tell git to ignore these files by creating a .gitignore file in the root of the project directory. Add the following contents to the file:
node_modules
dist

Code tidying tools
We'll be using Prettier, which we first met in Chapter 2, to tidy our code in this project. We'll install Prettier again in this project. Install it using the following command:
bash
Copy to Clipboard
npm install --save-dev prettier

Note again that we are using --save-dev to add it as a dev dependency, because we only use it during development.
Like many tools made more recently Prettier comes with "sensible defaults". That means that you'll be able to use Prettier without having to configure anything (if you are happy with the defaults). This lets you get on with what's important: the creative work. For demonstration, we'll add a config file. Create a file in the root of your npm-experiment directory called .prettierrc.json. Add the following contents:
json
Copy to Clipboard
{
  "bracketSameLine": true
}

With this setting, Prettier will print the > of a multi-line HTML (HTML, JSX, Vue, Angular) opening tag at the end of the last line instead of being alone on the next line. This is the format the MDN itself uses. You can find more about configuring Prettier in its documentation.
By default, Prettier formats all files that you specify. However, again, we don't need to format generated files, or there may be certain legacy code that we don't want to touch. We can tell Prettier to always ignore these files by creating a .prettierignore file in the root of the project directory. Add the following contents to the file:
node_modules
dist

It has the same content of .gitignore, but in a real project, you might want to ignore different files for Prettier than you do for git.
Now that Prettier is installed and configured, running and tidying your code can be done on the command line, for example:
bash
Copy to Clipboard
npx prettier --write ./index.html

Note: In the command above, we use Prettier with the --write flag. Prettier understands this to mean "if there's any problem in my code format, go ahead and fix them, then save my file". This is fine for our development process, but we can also use prettier without the flag and it will only check the file. Checking the file (and not saving it) is useful for purposes like checks that run before a release - i.e., "don't release any code that's not been properly formatted."
You can also replace ./index.html with any other file or folder to format them. For example, . will format everything in the current directory. In case you may forget the syntax, you can add it as a custom script in your package.json too:
json
Copy to Clipboard
"scripts": {
  // …
  "format": "prettier --write ."
},

Now you can run the following to format the directory:
bash
Copy to Clipboard
npm run format

It can still be arduous to run the command every time we change something, and there are a few ways to automate this process:
Using special "git hooks" to test if the code is formatted before a commit.
Using code editor plugins to run Prettier commands each time a file is saved.
Note: What is a git hook? Git (not GitHub) provides a system that lets us attach pre- and post- actions to the tasks we perform with git (such as committing your code). Although git hooks can be a bit overly complicated (in this author's opinion), once they're in place they can be very powerful. If you're interested in using hooks, Husky is a greatly simplified route into using hooks.
For VS Code, one useful extension is the Prettier Code Formatter by Esben Petersen, which lets VS Code automatically format code upon saving. This means that any file in the project we are working on gets formatted nicely, including HTML, CSS, JavaScript, JSON, markdown, and more. All the editor needs is "Format On Save" enabled.
Code linting tools
Linting helps with code quality but also is a way to catch potential errors earlier during development. It's a key ingredient of a good toolchain and one that many development projects will include by default.
Web development linting tools mostly exist for JavaScript (though there are a few available for HTML and CSS). This makes sense: if an unknown HTML element or invalid CSS property is used, due to the resilient nature of these two languages nothing is likely to break. JavaScript is a lot more fragile — mistakenly calling a function that doesn't exist for example causes your JavaScript to break; linting JavaScript is therefore very important, especially for larger projects.
The go-to tool for JavaScript linting is ESLint. It's an extremely powerful and versatile tool but can be tricky to configure correctly and you could easily consume many hours trying to get a configuration just right!
ESLint is installed via npm, so as per discussions in Chapter 2, you have the choice to install this tool locally or globally, but a local installation is highly recommended, because you need to have a configuration file for each project anyway. Remember the command to run:
bash
Copy to Clipboard
npm install --save-dev eslint@8 @eslint/js globals

Note: eslint@8 installs the version 8 of ESLint, while the latest is v9. This is because eslint-plugin-react, which we will use later, does not support v9 yet.
The @eslint/js package provides predefined ESLint configuration, while the globals package provides a list of known global names in each environment. We will use them later in the configuration. Out of the box, ESLint is going to complain that it can't find the configuration file if you run it with npx eslint:
Oops! Something went wrong! :(

ESLint: 8.57.0

ESLint couldn't find a configuration file. To set up a configuration file for this project, please run:

...

Here's a minimal example that works (in a file called eslint.config.js, at the root of the project):
js
Copy to Clipboard
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules", "dist"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];

The above ESLint configuration:
Enables the "recommended" ESLint settings
Tells ESLint to ignore the generated files as we have already done for the other tools
Tells ESLint to include .js and .jsx files in linting
Tells ESLint about the existence of the browser global variables (used by lint rules such as no-undef for checking non-existent variables).
The ESLint parser doesn't understand JSX by default, and its recommended rules don't handle React-specific semantics. Therefore, we will add some more configuration to make it support JSX and React properly. First, install eslint-plugin-react and eslint-plugin-react-hooks, which provide rules for writing correct and idiomatic React:
bash
Copy to Clipboard
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks

Then, update the ESLint configuration file to include the recommended config of these plugins, which both loads the recommended rules and sets the parser options for JSX:
js
Copy to Clipboard
import js from "@eslint/js";
import globals from "globals";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import reactJSXRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules", "dist"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  reactRecommended,
  reactJSXRuntime,
  {
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    rules: reactHooksPlugin.configs.recommended.rules,
  },
];

Note: Our configuration for eslint-plugin-react-hooks is a bit awkward, compared to the one-line additions for eslint-plugin-react configurations. This is because eslint-plugin-react-hooks doesn't support the new ESLint config format yet. See facebook/react#28313 for more information.
There's a complete list of ESLint rules that you can tweak and configure to your heart's content and many companies and teams have published their own ESLint configurations, which can sometimes be useful either to get inspiration or to select one that you feel suits your own standards. A forewarning though: ESLint configuration is a very deep rabbit hole!
For the sake of simplicity, in this chapter, we're not going to explore all the features of ESLint, since this configuration works for our particular project and its requirements. However, bear in mind that if you want to refine and enforce a rule about how your code looks (or validates), it's very likely that it can be done with the right ESLint configuration.
As with other tools, code editor integration support is typically good for ESLint, and potentially more useful as it can give us real-time feedback when issues crop up:

That's our dev environment setup complete at this point. Now, finally we're (very nearly) ready to code.
Build and transformation tools
JavaScript transformation
For this project, as mentioned above, React is going to be used, which also means that JSX will be used in the source code. The project will also use the latest JavaScript features. An immediate issue is that no browser has native support for JSX; it is an intermediate language that is meant to be compiled into languages the browser understands in the production code. If the browser tries to run the source JavaScript it will immediately complain; the project needs a build tool to transform the source code to something the browser can consume without issue.
There's a number of choices for transform tools and though Babel is a particularly popular one, in Vite, we will use an integrated plugin: @vitejs/plugin-react. Install it using the following command:
bash
Copy to Clipboard
npm install --save-dev @vitejs/plugin-react

We don't have a Vite config yet! Add one at vite.config.js in the root of the project directory:
js
Copy to Clipboard
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/npm-experiment/",
});

Read the Vite documentation for more information on how to configure Vite. Because our site is deployed on GitHub pages, it will be hosted at https://your-username.github.io/your-repo-name, so you should set the base option according to your GitHub repository's name—but you can always adjust it later when we get to deployment.
CSS transformation
Our CSS may also be using syntax not understood by browsers. For example, you may use a syntax that was only implemented in the last few browser versions, which means older browsers will fail on it and display broken style. We can use a tool to transform our CSS into a format that all browsers that we target can understand.
PostCSS is a CSS postprocessor tool. Compared to build tools like Sass, PostCSS is intended to write standard CSS (that is, CSS syntax that may get into browsers one day), while Sass is a custom language by itself that compiles to CSS. PostCSS is closer to the web and has a much lower learning curve. Vite supports PostCSS by default, so you just need to configure PostCSS if you want to compile any features. Check out the cssdb for what features are supported.
For our purposes, we are going to demonstrate another CSS transformation: CSS modules. It is one of the ways to achieve CSS modularization. Remember that CSS selectors are all global, so if you have a class name like .button, all elements with the class name button will be styled the same way. This often leads to naming conflicts — imagine all your JavaScript variables being defined at the global scope! CSS modules solve this problem by making the class name unique to the pages that use them. To understand how it works, after you've downloaded the source code, you can check how we use the .module.css files, and also read the CSS modules documentation.
Although this stage of our toolchain can be quite painful, because we've chosen a tool that purposely tries to reduce configuration and complexity, there's really nothing more we need to do during the development phase. Modules are correctly imported, nested CSS is correctly transformed to "regular CSS", and our development is unimpeded by the build process.
Now our software is ready to be written!
Writing the source code
Now we have the full development toolchain set up, it's usually time to start writing real code — the part that you should actually invest the most time in. For our purpose though, we are just going to copy some existing source code and pretend that we wrote it. We won't teach you how they work, as that is not the point of this chapter. They are merely here to run the tools on, to teach you about how they work.
To get hold of the code files, visit https://github.com/mdn/client-toolchain-example and download and unzip the contents of this repo onto your local drive somewhere. You can download the entire project as a zip file by selecting Clone or download > Download ZIP.

Now copy the contents of the project's src directory and use it to replace your current src directory. You don't need to worry about the other files.
Also install a few dependencies that the source code uses:
bash
Copy to Clipboard
npm install react react-dom @tanstack/react-query

We have our project files in place. That's all we need to do for now!
Running the transformation
To start working with our project, we'll run the Vite server on the command line. In its default mode it will watch for changes in your code and refresh the server. This is nice because we don't have to flit back and forth between the code and the command line.
To start Vite off in the background, go to your terminal and run the following command (using the custom script we defined earlier):
bash
Copy to Clipboard
npm run dev
You should see an output like this (once the dependencies have been installed):
> client-toolchain-example@1.0.0 dev
> vite

Re-optimizing dependencies because lockfile has changed

  VITE v5.2.13  ready in 157 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
The server is now running on the URL that was printed (in this case localhost:5173).
Go to this URL in your browser and you will see the example app running!
Now we can make a few changes and view their effects live.
Load up the file src/App.jsx in your favorite text editor.
Replace all occurrences of mdn/content with your favorite GitHub repo, such as facebook/react.
Save the file, then go straight back to the app running in your browser. You'll notice that the browser has automatically refreshed, and the graphs have changed!
You could also try using ESLint and Prettier too — try deliberately removing a load of the whitespace from one of your files and running Prettier on it to clean it up, or introduce a syntax error into one of your JavaScript files and see what errors ESLint gives you when you run the eslint command, or in your editor.
Summary
We've come a long way in this chapter, building up a rather nice local development environment to create an application in.
At this point during web software development you would usually be crafting your code for the software you intend to build. Since this module is all about learning the tools around web development, not web development code itself, we won't be teaching you any actual coding — you'll find that information in the rest of MDN!
Instead, we've written an example project for you to use your tools on. We'd suggest that you work through the rest of the chapter using our example code, and then you can try changing the contents of the src directory to your own project and publishing that on GitHub Pages instead! And indeed, deploying to GitHub Pages will be the end goal of the next chapter!
Deploying our app
Previous


Overview: Understanding client-side web development tools


In the final article in our series, we take the example toolchain we built up in the previous article and add to it so that we can deploy our sample app. We push the code to GitHub, deploy it using GitHub Pages, and even show you how to add a simple test into the process.
Prerequisites:
Familiarity with the core HTML, CSS, and JavaScript languages.
Objective:
To finish working through our complete toolchain case study, focusing on deploying the app.


Post development
There's potentially a large range of problems to be solved in this section of the project's lifecycle. As such, it's important to create a toolchain that handles these problems in a way that requires as little manual intervention as possible.
Here's just a few things to consider for this particular project:
Generating a production build: Ensuring files are minimized, chunked, have tree-shaking applied, and that versions are "cache busted".
Running tests: These can range from "is this code formatted properly?" to "does this thing do what I expect?", and ensuring failing tests prevent deployment.
Actually deploying the updated code to a live URL: Or potentially a staging URL so it can be reviewed first.
Note: Cache busting is a new term that we haven't met before in the module. This is the strategy of breaking a browser's own caching mechanism, which forces the browser to download a new copy of your code. Vite (and indeed many other tools) will generate filenames that are unique to each new build. This unique filename "busts" your browser's cache, thereby making sure the browser downloads the fresh code each time an update is made to the deployed code.
The above tasks also break down into further tasks; note that most web development teams will have their own terms and processes for at least some part of the post-development phase.
For this project, we're going to use GitHub Pages's free static hosting offering to host our project. It not only serves our website on the Internet but also gives us a URL to our website. It's great — many MDN example websites are hosted on GitHub Pages.
Deploying to hosting tends to be at the tail-end of the project life cycle, but with services such as GitHub Pages bringing down the cost of deployments (both in financial terms and also the time required to actually deploy) it's possible to deploy during development to either share work in progress or to have a pre-release for some other purpose.
GitHub provides a smooth workflow to turn new code into a live website:
You push your code to GitHub.
You define a GitHub Action that gets triggered when there's a new push to the main branch, which builds the code and puts it at a specific location.
GitHub Pages then serves the code at a specific URL.
It's exactly these kinds of connected services that we would encourage you to look for when deciding on your own build toolchain. We can commit our code and push to GitHub and the updated code will automatically trigger the entire build routine. If all is well, we get a live change deployed automatically. The only action we need to perform is that initial "push".
However, we do have to set these steps up, and we'll look at that now.
The build process
Again, because we're using Vite for development, the build option is extremely simple to add. As we saw earlier, we already have a custom script npm run build that will let Vite build everything ready for production instead of just running it for development and testing purposes. This includes doing minification and tree-shaking of code, and cache-busting on filenames.
It is a good best practice to always define a build script in your project, so we can then rely on npm run build to always do the complete build step, without needing to remember the specific build command arguments for each project.
The newly-created production code is placed in a new directory called dist, which contains all the files required to run the website, ready for you to upload to a server.
However, doing this step manually isn't our final aim — what we want is for the build to happen automatically and the result of the dist directory to be deployed live on our website.
Committing changes to GitHub
This section will get you over the line to storing your code in a git repository, but it is a far cry from a git tutorial. There are many great tutorials and books available, and our Git and GitHub page is a good place to start.
We initialized our working directory as a git working directory earlier on. A quick way to verify this is to run the following command:
bash
Copy to Clipboard
git status
You should get a status report of what files are being tracked, what files are staged, and so on — all terms that are part of the git grammar. If you get the error fatal: not a git repository returned, then the working directory is not a git working directory and you'll need to initialize git using git init.
Now we have three tasks ahead of us:
Add any changes we've made to the stage (a special name for the place that git will commit files from).
Commit the changes to the repository.
Push the changes to GitHub.
To add changes, run the following command:
bash
Copy to Clipboard
git add .
Note the period at the end, it means "everything in this directory". The git add . command is a bit of a sledgehammer approach — it will add all local changes you've worked on in one go. If you want finer control over what you add, then use git add -p for an interactive process, or add individual files using git add path/to/file.
Now all the code is staged, we can commit; run the following command:
bash
Copy to Clipboard
git commit -m 'committing initial code'
Note: Although you're free to write whatever you wish in the commit message, there's some useful tips around the web on good commit messages. Keep them short, concise, and descriptive, so they clearly describe what the change does.
Finally, the code needs to be pushed to your GitHub-hosted repository. Let's do that now.
Over at GitHub, visit https://github.com/new and create your own repository to host this code.
Give your repository a short, memorable name, without spaces in it (use hyphens to separate words), and a description, then click Create repository at the bottom of the page.
You should now have a "remote" URL that points to your new GitHub repo.

This remote location needs to be added to our local git repository before we can push it up there, otherwise it won't be able to find it. You'll need to run a command with the following structure (use the provided HTTPS option for now — especially if you are new to GitHub — not the SSH option):
bash
Copy to Clipboard
git remote add origin https://github.com/your-name/repo-name.git
So if your remote URL was https://github.com/remy/super-website.git, as in the screenshot above, your command would be
bash
Copy to Clipboard
git remote add origin https://github.com/remy/super-website.git
Change the URL to your own repository, and run it now.
Note: After you've chosen your repository name, make sure the base option in your vite.config.js reflects this name, as mentioned in the previous chapter. Otherwise, the JavaScript and CSS assets will not be linked correctly.
Now we're ready to push our code to GitHub; run the following command now:
bash
Copy to Clipboard
git push origin main
At this point, you'll be prompted to enter a username and password before Git will allow the push to be sent. This is because we used the HTTPS option rather than the SSH option, as seen in the screenshot earlier. For this, you need your GitHub username and then — if you do not have two-factor authentication (2FA) turned on — your GitHub password. We would always encourage you to use 2FA if possible, but bear in mind that if you do, you'll also need to use a "personal access token". GitHub help pages has an excellent and simple walkthrough covering how to get one.
Note: If you are interested in using the SSH option, thereby avoiding the need to enter your username and password every time you push to GitHub, this tutorial walks you through how.
This final command instructs git to push the code to the "remote" location that we called origin (that's the repository hosted on github.com — we could have called it anything we like) using the branch main. We've not encountered branches at all, but the "main" branch is the default place for our work and it's what git starts on. When we define the action triggered to build the website, we'll also let it watch for changes on the "main" branch.
Note: Until October 2020 the default branch on GitHub was master, which for various social reasons was switched to main. You should be aware that this older default branch may appear in various projects you encounter, but we'd suggest using main for your own projects.
So with our project committed in git and pushed to our GitHub repository, the next step in the toolchain is to define a build action so our project can be deployed live on the web!
Using GitHub Actions for deployment
GitHub Actions, like ESLint configuration, is another deep rabbit hole to dive into. It's not easy to get right on your first try, but for popular tasks like "build a static website and deploy it to GitHub Pages", there are many examples to copy and paste from. You can follow the instructions in Publishing with a custom GitHub Actions workflow. You can check our GitHub Action file for a working example. (The name of the file doesn't matter.)
After you commit this file to the main branch, you should see a little green tick next to the commit title:

If you see a yellow dot, it means the action is running, and if you see a red cross, it means the action failed. Click on the icon and you can see the status and the logs of your own build action (named "Deploy build" in our case).
After waiting for a few more minutes, you can visit your GitHub Pages URL to see your website live on the web. The link looks like https://<your-name>.github.io/<repo-name>. For our example, it's at https://mdn.github.io/client-toolchain-example/.
Now for one final link in our toolchain: a test to ensure our code works.
Testing
Testing itself is a vast subject, even within the realm of front-end development. I'll show you how to add an initial test to your project and how to use the test to prevent or to allow the project deployment to happen.
When approaching tests there are a good deal of ways to approach the problem:
End-to-end testing, which involves your visitor clicking a thing and some other thing happening.
Integration testing, which basically says "does one block of code still work when connected to another block?"
Unit testing, where small and specific bits of functionality are tested to see if they do what they are supposed to do.
And many more types. Also, see our cross browser testing module for a bunch of useful testing information.
Remember also that tests are not limited to JavaScript; tests can be run against the rendered DOM, user interactions, CSS, and even how a page looks.
However, for this project we're going to create a small test that will check if the GitHub API data is in the correct format. If not, the test will fail and will prevent the project from going live. To do anything else would be beyond the scope of this module — testing is a huge subject that really requires its own separate module. We are hoping that this section will at least make you aware of the need for testing, and will plant the seed that inspires you to go and learn more.
The test itself isn't what is important. What is important is how the failure or success is handled. Because we are writing a custom build action already, we can add a step before the build that runs the test. If the test fails, the build will fail, and the deployment will not happen.
The good news is: because we are using Vite, Vite already offers a good integrated tool for testing: Vitest.
Let's get started.
Install Vitest:
bash
Copy to Clipboard
npm install --save-dev vitest


In your package.json, find your scripts member, and update it so that it contains the following test and build commands:
json
Copy to Clipboard
"scripts": {
  // …
  "test": "vitest"
}
Note: Here's the good part of using Vite alongside Vitest: if you use other testing frameworks, you need to add another configuration that describes how the test files need to be transformed, but Vitest will automatically use the Vite configuration.
Now of course we need to add the test to our codebase. Normally, if you are testing the functionality of a file, say App.jsx, you would add a file called App.test.jsx next to it. In this case, we are just testing the data, so let's create another directory to hold our tests. You can open the example repository you downloaded in the previous chapter, and copy the tests folder over.
Now to manually run the test, from the command line we can run:
bash
Copy to Clipboard
npm run test
You should see output like this:
> client-toolchain-example@1.0.0 test
> vitest


DEV  v1.6.0 /Users/joshcena/Desktop/work/Tech/projects/mdn/client-toolchain-example

✓ tests/api.test.js (1) 896ms
  ✓ GitHub API returns the right response 896ms

Test Files  1 passed (1)
     Tests  1 passed (1)
  Start at  23:12:25
  Duration  1.03s (transform 15ms, setup 0ms, collect 5ms, tests 896ms, environment 0ms, prepare 38ms)


PASS  Waiting for file changes...
      press h to show help, press q to quit
This means the test passed. Like Vite, it will watch for changes and re-run the tests when you save a file. We can quit by pressing q.
We still need to wire the test to our build action, so it blocks the build if the test fails. Open the .github/workflows/github-pages.yml file (or whatever file name you gave to your build action) and add the following step, right before the step that runs npm run build:
yaml
Copy to Clipboard
- name: Install deps
  run: npm ci

# Add this
- name: Run tests
  run: npm run test

- name: Build
  run: npm run build
This will run the test before the build step. If the test fails, the build will fail, and the deployment will not happen.
Now let's upload the new code to GitHub, using similar commands to what you used before:
bash
Copy to Clipboard
git add .
git commit -m 'adding test'
git push origin main
In some cases you might want to test the result of the built code (since this isn't quite the original code we wrote), so the test might need to be run after the build command. You'll need to consider all these individual aspects whilst you're working on your own projects.
Finally, a minute or so after pushing, GitHub Pages will deploy the project update. But only if it passes the test that was introduced.
Summary
That's it for our sample case study, and for the module! We hope you found it useful. While there is a long way to go before you can consider yourself a client-side tooling wizard, we are hoping that this module has given you that first important step towards understanding client-side tooling, and the confidence to learn more and try out new things.
Let's summarize all the parts of the toolchain:
Code quality and maintenance are performed by ESLint and Prettier. These tools are added as devDependencies to the project via npm install --dev eslint prettier eslint-plugin-react ... (the ESLint plugin is needed because this particular project uses React).
There are two configuration files that the code quality tools read: eslint.config.js and .prettierrc.
During development, we continue to add dependencies using npm. The Vite development server is running in the background to watch for changes and to automatically build our source.
Deployment is handled by pushing our changes to GitHub (on the "main" branch), which triggers a build and deployment using GitHub Actions to publish the project. For our instance this URL is https://mdn.github.io/client-toolchain-example/; you will have your own unique URL.
We also have a simple test that blocks the building and deployment of the site if the GitHub API feed isn't giving us the correct data format.
For those of you wanting a challenge, consider whether you can optimize some part of this toolchain. Some questions to ask yourself:
Can we extract only the features of plotly.js that we need? This will reduce the JavaScript bundle size.
Maybe you want to add other tools, such as TypeScript for type checking, or stylelint for CSS linting?
Could React be swapped out for something smaller?
Could you add more tests to prevent a bad build from deploying, such as performance audits?
Could you set up a notification to let you know when a new deploy succeeded or failed?
Previous




Server-side website programming
The Dynamic Websites – Server-side programming topic is a series of modules that show how to create dynamic websites; websites that deliver customized information in response to HTTP requests. The modules provide a general introduction to server-side programming, along with specific beginner-level tutorials on how to use the Django (Python) and Express (Node.js/JavaScript) web frameworks to create basic applications.
Most major websites use some kind of server-side technology to dynamically display data as required. For example, imagine how many products are available on Amazon, and imagine how many posts have been written on Facebook. Displaying all of these using different static pages would be extremely inefficient, so instead such sites display static templates (built using HTML, CSS, and JavaScript), and then dynamically update the data displayed inside those templates when needed, such as when you want to view a different product on Amazon.
In the modern world of web development, learning about server-side development is highly recommended.
Prerequisites
Getting started with server-side programming is usually easier than client-side development, because dynamic websites tend to perform a lot of very similar operations (retrieving data from a database and displaying it in a page, validating user-entered data and saving it in a database, checking user permissions and logging users in, etc.), and are constructed using web frameworks that make these and other common web server operations easy.
Basic knowledge of programming concepts (or of a particular programming language) is useful, but not essential. Similarly, expertise in client-side coding is not required, but a basic knowledge will help you work better with the developers creating your client-side web "front end".
You will need to understand "how the web works". We recommend that you first read the following topics:
What is a web server
What software do I need to build a website?
How do you upload files to a web server?
With that basic understanding, you'll be ready to work your way through the modules in this section.
Modules
This topic contains the following modules. You should start with the first module, then go on to one of the following modules, which show how to work with two very popular server-side languages using appropriate web frameworks.
Server-side website programming first steps
This module provides technology-agnostic information about server-side website programming such as "what is it?", "how does it differ from client-side programming?", and "why is it useful?". This module also outlines some of the more popular server-side web frameworks and gives guidance on how to select the best one for your site. Lastly, an introduction to web server security is provided.
Django Web Framework (Python)
Django is an extremely popular and fully featured server-side web framework, written in Python. The module explains why Django is such a good web server framework, how to set up a development environment and how to perform common tasks with it.
Express Web Framework (Node.js/JavaScript)
Express is a popular web framework, written in JavaScript and hosted within the Node.js runtime environment. The module explains some of the key benefits of this framework, how to set up your development environment and how to perform common web development and deployment tasks.
See also
Node server without framework
This article provides a simple static file server built with pure Node.js, for those of you not wanting to use a framework.
Properly configuring server MIME types
Configuring your server to send the correct MIME types (also known as media types or content types) to browsers is important for browsers to be able to properly process and display the content. It is also important to prevent malicious content from masquerading as benign content.
Apache Configuration: .htaccess
Apache .htaccess files allow users to configure directories of the web server they control without modifying the main configuration file.
Server-side website programming first steps
Overview: Server-side website programming


Next


In this module, we answer a few fundamental questions about server-side programming such as "What is it?", "How does it differ from client-side programming?", and "Why is it so useful?". We also provide an overview of some of the most popular server-side web frameworks, along with guidance on how to select the most suitable framework for creating your first project. Finally, we provide a high-level introductory article about web server security.
Prerequisites
Before starting this module, you don't need to have any knowledge of server-side website programming or any other type of programming.
However, you should understand something about the workings of websites and web servers. For that purpose, this is our recommended reading:
What is a web server?
What software do I need to build a website?
How do you upload files to a web server?
With the basic understanding that you gain from this preparation, you'll be ready to work your way through the modules in this section.
Tutorials
Introduction to the server-side
Welcome to the MDN beginner's server-side programming course! The first article examines server-side programming from a high level, answering questions such as "What is it?", "How does it differ from client-side programming?", and "Why it is so useful?". After reading this, you will understand the additional capabilities available to websites through server-side coding.
Client-Server overview
Now that you know the purpose and potential benefits of server-side programming, we're going to examine what happens when a server receives a "dynamic request" from a browser. As most websites' server-side code handles requests and responses in a similar way, this will help you understand what you need to do when writing your own code.
Server-side web frameworks
The previous article explained what a server-side web application needs to do to respond to web browser requests. This article explains how web frameworks can simplify these tasks, and helps you choose the right framework for your first server-side web application.
Website security
Website security requires vigilance in all aspects of building and operating a site. This introductory article helps you understand the first important steps you can take to protect your web application against the most common threats.
Note: This topic deals with server-side frameworks, and how to use them to create websites. If you are looking for information on client-side JavaScript frameworks, see Understanding client-side JavaScript frameworks.
Assessments
This "first steps" module doesn't have any assessment because we haven't yet shown you any code. At this point, you should have a general understanding of the functionality you can deliver with server-side programming, and you have made a decision about what server-side web framework you will use to create your first server-side application.



Introduction to the server side
Overview: Server-side website programming first steps


Next


Welcome to the MDN beginner's server-side programming course! In this first article, we look at server-side programming from a high level, answering questions such as "what is it?", "how does it differ from client-side programming?", and "why it is so useful?". After reading this article you'll understand the additional power available to websites through server-side coding.
Prerequisites:
A basic understanding of what a web server is.
Objective:
To gain familiarity with what server-side programming is, what it can do, and how it differs from client-side programming.

Most large-scale websites use server-side code to dynamically display different data when needed, generally pulled out of a database stored on a server and sent to the client to be displayed via some code (e.g., HTML and JavaScript).
Perhaps the most significant benefit of server-side code is that it allows you to tailor website content for individual users. Dynamic sites can highlight content that is more relevant based on user preferences and habits. It can also make sites easier to use by storing personal preferences and information — for example reusing stored credit card details to streamline subsequent payments.
It can even allow interaction with users of the site, sending notifications and updates via email or through other channels. All of these capabilities enable much deeper engagement with users.
In the modern world of web development, learning about server-side development is highly recommended.
What is server-side website programming?
Web browsers communicate with web servers using the HyperText Transfer Protocol (HTTP). When you click a link on a web page, submit a form, or run a search, an HTTP request is sent from your browser to the target server.
The request includes a URL identifying the affected resource, a method that defines the required action (for example to get, delete, or post the resource), and may include additional information encoded in URL parameters (the field-value pairs sent via a query string), as POST data (data sent by the HTTP POST method), or in associated cookies.
Web servers wait for client request messages, process them when they arrive, and reply to the web browser with an HTTP response message. The response contains a status line indicating whether or not the request succeeded (e.g., "HTTP/1.1 200 OK" for success).
The body of a successful response to a request would contain the requested resource (e.g., a new HTML page, or an image), which could then be displayed by the web browser.
Static sites
The diagram below shows a basic web server architecture for a static site (a static site is one that returns the same hard-coded content from the server whenever a particular resource is requested). When a user wants to navigate to a page, the browser sends an HTTP "GET" request specifying its URL.
The server retrieves the requested document from its file system and returns an HTTP response containing the document and a success status (usually 200 OK). If the file cannot be retrieved for some reason, an error status is returned (see client error responses and server error responses).

Dynamic sites
A dynamic website is one where some of the response content is generated dynamically, only when needed. On a dynamic website, HTML pages are normally created by inserting data from a database into placeholders in HTML templates (this is a much more efficient way of storing large amounts of content than using static websites).
A dynamic site can return different data for a URL based on information provided by the user or stored preferences and can perform other operations as part of returning a response (e.g., sending notifications).
Most of the code to support a dynamic website must run on the server. Creating this code is known as "server-side programming" (or sometimes "back-end scripting").
The diagram below shows an architecture for a dynamic website. As in the previous diagram, browsers send HTTP requests to the server, then the server processes the requests and returns appropriate HTTP responses.
Requests for static resources are handled in the same way as for static sites (static resources are any files that don't change — typically: CSS, JavaScript, Images, pre-created PDF files, etc.).

Requests for dynamic resources are instead forwarded (2) to server-side code (shown in the diagram as a Web Application). For "dynamic requests" the server interprets the request, reads required information from the database (3), combines the retrieved data with HTML templates (4), and sends back a response containing the generated HTML (5,6).
Are server-side and client-side programming the same?
Let's now turn our attention to the code involved in server-side and client-side programming. In each case, the code is significantly different:
They have different purposes and concerns.
They generally don't use the same programming languages (the exception being JavaScript, which can be used on the server- and client-side).
They run inside different operating system environments.
Code running in the browser is known as client-side code and is primarily concerned with improving the appearance and behavior of a rendered web page. This includes selecting and styling UI components, creating layouts, navigation, form validation, etc. By contrast, server-side website programming mostly involves choosing which content is returned to the browser in response to requests. The server-side code handles tasks like validating submitted data and requests, using databases to store and retrieve data and sending the correct data to the client as required.
Client-side code is written using HTML, CSS, and JavaScript — it is run inside a web browser and has little or no access to the underlying operating system (including limited access to the file system).
Web developers can't control what browser every user might be using to view a website — browsers provide inconsistent levels of compatibility with client-side code features, and part of the challenge of client-side programming is handling differences in browser support gracefully.
Server-side code can be written in any number of programming languages — examples of popular server-side web languages include PHP, Python, Ruby, C#, and JavaScript (NodeJS). The server-side code has full access to the server operating system and the developer can choose what programming language (and specific version) they wish to use.
Developers typically write their code using web frameworks. Web frameworks are collections of functions, objects, rules and other code constructs designed to solve common problems, speed up development, and simplify the different types of tasks faced in a particular domain.
Again, while both client and server-side code use frameworks, the domains are very different, and hence so are the frameworks. Client-side web frameworks simplify layout and presentation tasks while server-side web frameworks provide a lot of "common" web server functionality that you might otherwise have to implement yourself (e.g., support for sessions, support for users and authentication, easy database access, templating libraries, etc.).
Note: Client-side frameworks are often used to help speed up development of client-side code, but you can also choose to write all the code by hand; in fact, writing your code by hand can be quicker and more efficient if you only need a small, simple website UI.
In contrast, you would almost never consider writing the server-side component of a web app without a framework — implementing a vital feature like an HTTP server is really hard to do from scratch in say Python, but Python web frameworks like Django provide one out of the box, along with other very useful tools.
What can you do on the server-side?
Server-side programming is very useful because it allows us to efficiently deliver information tailored for individual users and thereby create a much better user experience.
Companies like Amazon use server-side programming to construct search results for products, make targeted product suggestions based on client preferences and previous buying habits, simplify purchases, etc.
Banks use server-side programming to store account information and allow only authorized users to view and make transactions. Other services like Facebook, Twitter, Instagram, and Wikipedia use server-side programming to highlight, share, and control access to interesting content.
Some of the common uses and benefits of server-side programming are listed below. You'll note that there is some overlap!
Efficient storage and delivery of information
Imagine how many products are available on Amazon, and imagine how many posts have been written on Facebook? Creating a separate static page for each product or post would be completely impractical.
Server-side programming allows us to instead store the information in a database and dynamically construct and return HTML and other types of files (e.g., PDFs, images, etc.). It is also possible to return data (JSON, XML, etc.) for rendering by appropriate client-side web frameworks (this reduces the processing burden on the server and the amount of data that needs to be sent).
The server is not limited to sending information from databases, and might alternatively return the result of software tools, or data from communications services. The content can even be targeted for the type of client device that is receiving it.
Because the information is in a database, it can also more easily be shared and updated with other business systems (for example, when products are sold either online or in a shop, the shop might update its database of inventory).
Note: Your imagination doesn't have to work hard to see the benefit of server-side code for efficient storage and delivery of information:
Go to Amazon or some other e-commerce site.
Search for a number of keywords and note how the page structure doesn't change, even though the results do.
Open two or three different products. Note again how they have a common structure and layout, but the content for different products has been pulled from the database.
For a common search term ("fish", say) you can see literally millions of returned values. Using a database allows these to be stored and shared efficiently, and it allows the presentation of the information to be controlled in just one place.
Customized user experience
Servers can store and use information about clients to provide a convenient and tailored user experience. For example, many sites store credit cards so that details don't have to be entered again. Sites like Google Maps can use saved or current locations for providing routing information, and search or travel history to highlight local businesses in search results.
A deeper analysis of user habits can be used to anticipate their interests and further customize responses and notifications, for example providing a list of previously visited or popular locations you may want to look at on a map.
Note: Google Maps saves your search and visit history. Frequently visited or frequently searched locations are highlighted more than others.
Google search results are optimized based on previous searches.
Go to Google search.
Search for "football".
Now try typing "favorite" in the search box and observe the autocomplete search predictions.
Coincidence? Nada!
Controlled access to content
Server-side programming allows sites to restrict access to authorized users and serve only the information that a user is permitted to see.
Real-world examples include social-networking sites which allow users to determine who can see the content they post to the site, and whose content appears in their feed.
Note: Consider other real examples where access to content is controlled. For example, what can you see if you go to the online site for your bank? Log in to your account — what additional information can you see and modify? What information can you see that only the bank can change?
Store session/state information
Server-side programming allows developers to make use of sessions — basically, a mechanism that allows a server to store information associated with the current user of a site and send different responses based on that information.
This allows, for example, a site to know that a user has previously logged in and display links to their emails or order history, or perhaps save the state of a simple game so that the user can go to a site again and carry on where they left it.
Note: Visit a newspaper site that has a subscription model and open a bunch of tabs (e.g., The Age). Continue to visit the site over a few hours/days. Eventually, you will start to be redirected to pages explaining how to subscribe, and you will be unable to access articles. This information is an example of session information stored in cookies.
Notifications and communication
Servers can send general or user-specific notifications through the website itself or via email, SMS, instant messaging, video conversations, or other communications services.
A few examples include:
Facebook and Twitter send emails and SMS messages to notify you of new communications.
Amazon regularly sends product emails that suggest products similar to those already bought or viewed that you might be interested in.
A web server might send warning messages to site administrators alerting them to low memory on the server, or suspicious user activity.
Note: The most common type of notification is a "confirmation of registration". Pick almost any large site that you are interested in (Google, Amazon, Instagram, etc.) and create a new account using your email address. You will shortly receive an email confirming your registration, or requiring acknowledgment to activate your account.
Data analysis
A website may collect a lot of data about users: what they search for, what they buy, what they recommend, how long they stay on each page. Server-side programming can be used to refine responses based on analysis of this data.
For example, Amazon and Google both advertise products based on previous searches (and purchases).
Note: If you're a Facebook user, go to your main feed and look at the stream of posts. Note how some of the posts are out of numerical order - in particular, posts with more "likes" are often higher on the list than more recent posts.
Also look at what kind of ads you are being shown — you might see ads for things you looked at on other sites. Facebook's algorithm for highlighting content and advertising can be a bit of a mystery, but it is clear that it does depend on your likes and viewing habits!
Summary
Congratulations, you've reached the end of the first article about server-side programming.
You've now learned that server-side code is run on a web server and that its main role is to control what information is sent to the user (while client-side code mainly handles the structure and presentation of that data to the user).
You should also understand that it is useful because it allows us to create websites that efficiently deliver information tailored for individual users and have a good idea of some of the things you might be able to do when you're a server-side programmer.
Lastly, you should understand that server-side code can be written in a number of programming languages and that you should use a web framework to make the whole process easier.
In a future article we'll help you choose the best web framework for your first site. Here we'll take you through the main client-server interactions in just a little more detail.
Client-server overview
Previous


Overview: Server-side website programming first steps


Next


Now that you know the purpose and potential benefits of server-side programming, we're going to examine in detail what happens when a server receives a "dynamic request" from a browser. As most website server-side code handles requests and responses in similar ways, this will help you understand what you need to do when writing most of your own code.
Prerequisites:
A basic understanding of what a web server is.
Objective:
To understand client-server interactions in a dynamic website, and in particular what operations need to be performed by server-side code.

There is no real code in the discussion because we haven't yet chosen a web framework to use to write our code! This discussion is however still very relevant, because the described behavior must be implemented by your server-side code, irrespective of which programming language or web framework you select.
Web servers and HTTP (a primer)
Web browsers communicate with web servers using the HyperText Transfer Protocol (HTTP). When you click a link on a web page, submit a form, or run a search, the browser sends an HTTP Request to the server.
This request includes:
A URL identifying the target server and resource (e.g., an HTML file, a particular data point on the server, or a tool to run).
A method that defines the required action (for example, to get a file or to save or update some data). The different methods/verbs and their associated actions are listed below:
GET: Get a specific resource (e.g., an HTML file containing information about a product, or a list of products).
POST: Create a new resource (e.g., add a new article to a wiki, add a new contact to a database).
HEAD: Get the metadata information about a specific resource without getting the body like GET would. You might for example use a HEAD request to find out the last time a resource was updated, and then only use the (more "expensive") GET request to download the resource if it has changed.
PUT: Update an existing resource (or create a new one if it doesn't exist).
DELETE: Delete the specified resource.
TRACE, OPTIONS, CONNECT, PATCH: These verbs are for less common/advanced tasks, so we won't cover them here.
Additional information can be encoded with the request (for example, HTML form data). Information can be encoded as:
URL parameters: GET requests encode data in the URL sent to the server by adding name/value pairs onto the end of it — for example http://example.com?name=Fred&age=11. You always have a question mark (?) separating the rest of the URL from the URL parameters, an equals sign (=) separating each name from its associated value, and an ampersand (&) separating each pair. URL parameters are inherently "insecure" as they can be changed by users and then resubmitted. As a result URL parameters/GET requests are not used for requests that update data on the server.
POST data. POST requests add new resources, the data for which is encoded within the request body.
Client-side cookies. Cookies contain session data about the client, including keys that the server can use to determine their login status and permissions/accesses to resources.
Web servers wait for client request messages, process them when they arrive, and reply to the web browser with an HTTP response message. The response contains an HTTP Response status code indicating whether or not the request succeeded (e.g., 200 OK for success, 404 Not Found if the resource cannot be found, 403 Forbidden if the user isn't authorized to see the resource, etc.). The body of the response to a successful GET request contains the requested resource.
When an HTML page is returned, it is rendered by the web browser. As part of processing, the browser may discover links to other resources (e.g., an HTML page usually references JavaScript and CSS files), and will send separate HTTP Requests to download these files.
Both static and dynamic websites (discussed in the following sections) use exactly the same communication protocol/patterns.
GET request/response example
You can make a simple GET request by clicking on a link or searching on a site (like a search engine homepage). For example, the HTTP request that is sent when you perform a search on MDN for the term "client-server overview" will look a lot like the text shown below (it will not be identical because parts of the message depend on your browser/setup).
Note: The format of HTTP messages is defined in a "web standard" (RFC9110). You don't need to know this level of detail, but at least now you know where this all came from!
The request
Each line of the request contains information about it. The first part is called the header, and contains useful information about the request, in the same way that an HTML head contains useful information about an HTML document (but not the actual content itself, which is in the body):
http
Copy to Clipboard
GET /en-US/search?q=client+server+overview&topic=apps&topic=html&topic=css&topic=js&topic=api&topic=webdev HTTP/1.1
Host: developer.mozilla.org
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Referer: https://developer.mozilla.org/en-US/
Accept-Encoding: gzip, deflate, sdch, br
Accept-Language: en-US,en;q=0.8,es;q=0.6
Cookie: sessionid=6ynxs23n521lu21b1t136rhbv7ezngie; csrftoken=zIPUJsAZv6pcgCBJSCj1zU6pQZbfMUAT; dwf_section_edit=False; dwf_sg_task_completion=False; _gat=1; _ga=GA1.2.1688886003.1471911953; ffo=true

The first and second lines contain most of the information we talked about above:
The type of request (GET).
The target resource URL (/en-US/search).
The URL parameters (q=client%2Bserver%2Boverview&topic=apps&topic=html&topic=css&topic=js&topic=api&topic=webdev).
The target/host website (developer.mozilla.org).
The end of the first line also includes a short string identifying the specific protocol version (HTTP/1.1).
The final line contains information about the client-side cookies — you can see in this case the cookie includes an id for managing sessions (Cookie: sessionid=6ynxs23n521lu21b1t136rhbv7ezngie; …).
The remaining lines contain information about the browser used and the sort of responses it can handle. For example, you can see here that:
My browser (User-Agent) is Mozilla Firefox (Mozilla/5.0).
It can accept gzip compressed information (Accept-Encoding: gzip).
It can accept the specified languages (Accept-Language: en-US,en;q=0.8,es;q=0.6).
The Referer line indicates the address of the web page that contained the link to this resource (i.e., the origin of the request, https://developer.mozilla.org/en-US/).
HTTP requests can also have a body, but it is empty in this case.
The response
The first part of the response for this request is shown below. The header contains information like the following:
The first line includes the response code 200 OK, which tells us that the request succeeded.
We can see that the response is text/html formatted (Content-Type).
We can also see that it uses the UTF-8 character set (Content-Type: text/html; charset=utf-8).
The head also tells us how big it is (Content-Length: 41823).
At the end of the message we see the body content — which contains the actual HTML returned by the request.
http
Copy to Clipboard
HTTP/1.1 200 OK
Server: Apache
X-Backend-Server: developer1.webapp.scl3.mozilla.com
Vary: Accept, Cookie, Accept-Encoding
Content-Type: text/html; charset=utf-8
Date: Wed, 07 Sep 2016 00:11:31 GMT
Keep-Alive: timeout=5, max=999
Connection: Keep-Alive
X-Frame-Options: DENY
Allow: GET
X-Cache-Info: caching
Content-Length: 41823

<!doctype html>
<html lang="en-US" dir="ltr" class="redesign no-js" data-ffo-opensanslight=false data-ffo-opensans=false >
<head prefix="og: http://ogp.me/ns#">
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <script>(function(d) { d.className = d.className.replace(/\bno-js/, ''); })(document.documentElement);</script>
  …

The remainder of the response header includes information about the response (e.g., when it was generated), the server, and how it expects the browser to handle the page (e.g., the X-Frame-Options: DENY line tells the browser not to allow this page to be embedded in an <iframe> in another site).
POST request/response example
An HTTP POST is made when you submit a form containing information to be saved on the server.
The request
The text below shows the HTTP request made when a user submits new profile details on this site. The format of the request is almost the same as the GET request example shown previously, though the first line identifies this request as a POST.
http
Copy to Clipboard
POST /en-US/profiles/hamishwillee/edit HTTP/1.1
Host: developer.mozilla.org
Connection: keep-alive
Content-Length: 432
Pragma: no-cache
Cache-Control: no-cache
Origin: https://developer.mozilla.org
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36
Content-Type: application/x-www-form-urlencoded
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Referer: https://developer.mozilla.org/en-US/profiles/hamishwillee/edit
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.8,es;q=0.6
Cookie: sessionid=6ynxs23n521lu21b1t136rhbv7ezngie; _gat=1; csrftoken=zIPUJsAZv6pcgCBJSCj1zU6pQZbfMUAT; dwf_section_edit=False; dwf_sg_task_completion=False; _ga=GA1.2.1688886003.1471911953; ffo=true

csrfmiddlewaretoken=zIPUJsAZv6pcgCBJSCj1zU6pQZbfMUAT&user-username=hamishwillee&user-fullname=Hamish+Willee&user-title=&user-organization=&user-location=Australia&user-locale=en-US&user-timezone=Australia%2FMelbourne&user-irc_nickname=&user-interests=&user-expertise=&user-twitter_url=&user-stackoverflow_url=&user-linkedin_url=&user-mozillians_url=&user-facebook_url=

The main difference is that the URL doesn't have any parameters. As you can see, the information from the form is encoded in the body of the request (for example, the new user fullname is set using: &user-fullname=Hamish+Willee).
The response
The response from the request is shown below. The status code of 302 Found tells the browser that the post succeeded, and that it must issue a second HTTP request to load the page specified in the Location field. The information is otherwise similar to that for the response to a GET request.
http
Copy to Clipboard
HTTP/1.1 302 FOUND
Server: Apache
X-Backend-Server: developer3.webapp.scl3.mozilla.com
Vary: Cookie
Vary: Accept-Encoding
Content-Type: text/html; charset=utf-8
Date: Wed, 07 Sep 2016 00:38:13 GMT
Location: https://developer.mozilla.org/en-US/profiles/hamishwillee
Keep-Alive: timeout=5, max=1000
Connection: Keep-Alive
X-Frame-Options: DENY
X-Cache-Info: not cacheable; request wasn't a GET or HEAD
Content-Length: 0

Note: The HTTP responses and requests shown in these examples were captured using the Fiddler application, but you can get similar information using web sniffers (e.g., WebSniffer) or packet analyzers like Wireshark. You can try this yourself. Use any of the linked tools, and then navigate through a site and edit profile information to see the different requests and responses. Most modern browsers also have tools that monitor network requests (for example, the Network Monitor tool in Firefox).
Static sites
A static site is one that returns the same hard coded content from the server whenever a particular resource is requested. So for example if you have a page about a product at /static/my-product1.html, this same page will be returned to every user. If you add another similar product to your site you will need to add another page (e.g., my-product2.html) and so on. This can start to get really inefficient — what happens when you get to thousands of product pages? You would repeat a lot of code across each page (the basic page template, structure, etc.), and if you wanted to change anything about the page structure — like add a new "related products" section for example — then you'd have to change every page individually.
Note: Static sites are excellent when you have a small number of pages and you want to send the same content to every user. However they can have a significant cost to maintain as the number of pages becomes larger.
Let's recap on how this works, by looking again at the static site architecture diagram we looked at in the last article.

When a user wants to navigate to a page, the browser sends an HTTP GET request specifying the URL of its HTML page. The server retrieves the requested document from its file system and returns an HTTP response containing the document and an HTTP Response status code of 200 OK (indicating success). The server might return a different status code, for example 404 Not Found if the file is not present on the server, or 301 Moved Permanently if the file exists but has been redirected to a different location.
The server for a static site will only ever need to process GET requests, because the server doesn't store any modifiable data. It also doesn't change its responses based on HTTP Request data (e.g., URL parameters or cookies).
Understanding how static sites work is nevertheless useful when learning server-side programming, because dynamic sites handle requests for static files (CSS, JavaScript, static images, etc.) in exactly the same way.
Dynamic sites
A dynamic site is one that can generate and return content based on the specific request URL and data (rather than always returning the same hard-coded file for a particular URL). Using the example of a product site, the server would store product "data" in a database rather than individual HTML files. When receiving an HTTP GET Request for a product, the server determines the product ID, fetches the data from the database, and then constructs the HTML page for the response by inserting the data into an HTML template. This has major advantages over a static site:
Using a database allows the product information to be stored efficiently in an easily extensible, modifiable, and searchable way.
Using HTML templates makes it very easy to change the HTML structure, because this only needs to be done in one place, in a single template, and not across potentially thousands of static pages.
Anatomy of a dynamic request
This section provides a step-by-step overview of the "dynamic" HTTP request and response cycle, building on what we looked at in the last article with much more detail. In order to "keep things real" we'll use the context of a sports-team manager website where a coach can select their team name and team size in an HTML form and get back a suggested "best lineup" for their next game.
The diagram below shows the main elements of the "team coach" website, along with numbered labels for the sequence of operations when the coach accesses their "best team" list. The parts of the site that make it dynamic are the Web Application (this is how we will refer to the server-side code that processes HTTP requests and returns HTTP responses), the Database, which contains information about players, teams, coaches and their relationships, and the HTML Templates.

After the coach submits the form with the team name and number of players, the sequence of operations is:
The web browser creates an HTTP GET request to the server using the base URL for the resource (/best) and encoding the team and player number either as URL parameters (e.g., /best?team=my_team_name&show=11) or as part of the URL pattern (e.g., /best/my_team_name/11/). A GET request is used because the request is only fetching data (not modifying data).
The Web Server detects that the request is "dynamic" and forwards it to the Web Application for processing (the web server determines how to handle different URLs based on pattern matching rules defined in its configuration).
The Web Application identifies that the intention of the request is to get the "best team list" based on the URL (/best/) and finds out the required team name and number of players from the URL. The Web Application then gets the required information from the database (using additional "internal" parameters to define which players are "best", and possibly also getting the identity of the logged in coach from a client-side cookie).
The Web Application dynamically creates an HTML page by putting the data (from the Database) into placeholders inside an HTML template.
The Web Application returns the generated HTML to the web browser (via the Web Server), along with an HTTP status code of 200 ("success"). If anything prevents the HTML from being returned then the Web Application will return another code — for example "404" to indicate that the team does not exist.
The Web Browser will then start to process the returned HTML, sending separate requests to get any other CSS or JavaScript files that it references (see step 7).
The Web Server loads static files from the file system and returns them to the browser directly (again, correct file handling is based on configuration rules and URL pattern matching).
An operation to update a record in the database would be handled similarly, except that like any database update, the HTTP request from the browser should be encoded as a POST request.
Doing other work
A Web Application's job is to receive HTTP requests and return HTTP responses. While interacting with a database to get or update information are very common tasks, the code may do other things at the same time, or not interact with a database at all.
A good example of an additional task that a Web Application might perform would be sending an email to users to confirm their registration with the site. The site might also perform logging or other operations.
Returning something other than HTML
Server-side website code does not have to return HTML snippets/files in the response. It can instead dynamically create and return other types of files (text, PDF, CSV, etc.) or even data (JSON, XML, etc.).
This is especially relevant for websites that work by fetching content from the server using JavaScript and updating the page dynamically, rather than always loading a new page when new content is to be shown. See Making network requests with JavaScript for more on the motivation for this approach, and what this model looks like from the client's point of view.
Web frameworks simplify server-side web programming
Server-side web frameworks make writing code to handle the operations described above much easier.
One of the most important operations they perform is providing simple mechanisms to map URLs for different resources/pages to specific handler functions. This makes it easier to keep the code associated with each type of resource separate. It also has benefits in terms of maintenance, because you can change the URL used to deliver a particular feature in one place, without having to change the handler function.
For example, consider the following Django (Python) code that maps two URL patterns to two view functions. The first pattern ensures that an HTTP request with a resource URL of /best will be passed to a function named index() in the views module. A request that has the pattern /best/junior, will instead be passed to the junior() view function.
python
Copy to Clipboard
# file: best/urls.py
#

from django.conf.urls import url

from . import views

urlpatterns = [
    # example: /best/
    url(r'^$', views.index),
    # example: /best/junior/
    url(r'^junior/$', views.junior),
]

Note: The first parameters in the url() functions may look a bit odd (e.g., r'^junior/$') because they use a pattern matching technique called "regular expressions" (RegEx, or RE). You don't need to know how regular expressions work at this point, other than that they allow us to match patterns in the URL (rather than the hard coded values above) and use them as parameters in our view functions. As an example, a really simple RegEx might say "match a single uppercase letter, followed by between 4 and 7 lower case letters."
The web framework also makes it easy for a view function to fetch information from the database. The structure of our data is defined in models, which are Python classes that define the fields to be stored in the underlying database. If we have a model named Team with a field of "team_type" then we can use a simple query syntax to get back all teams that have a particular type.
The example below gets a list of all teams that have the exact (case sensitive) team_type of "junior" — note the format: field name (team_type) followed by double underscore, and then the type of match to use (in this case exact). There are many other types of matches and we can daisy chain them. We can also control the order and the number of results returned.
python
Copy to Clipboard
#best/views.py

from django.shortcuts import render

from .models import Team

def junior(request):
    list_teams = Team.objects.filter(team_type__exact="junior")
    context = {'list': list_teams}
    return render(request, 'best/index.html', context)

After the junior() function gets the list of junior teams, it calls the render() function, passing the original HttpRequest, an HTML template, and a "context" object defining the information to be included in the template. The render() function is a convenience function that generates HTML using a context and an HTML template, and returns it in an HttpResponse object.
Obviously web frameworks can help you with a lot of other tasks. We discuss a lot more benefits and some popular web framework choices in the next article.
Summary
At this point you should have a good overview of the operations that server-side code has to perform, and know some of the ways in which a server-side web framework can make this easier.
In a following module we'll help you choose the best Web Framework for your first site.
Server-side web frameworks
Previous


Overview: Server-side website programming first steps


Next


The previous article showed you what the communication between web clients and servers looks like, the nature of HTTP requests and responses, and what a server-side web application needs to do in order to respond to requests from a web browser. With this knowledge under our belt, it's time to explore how web frameworks can simplify these tasks, and give you an idea of how you'd choose a framework for your first server-side web application.
Prerequisites:
Basic understanding of how server-side code handles and responds to HTTP requests (see Client-Server overview).
Objective:
To understand how web frameworks can simplify development/maintenance of server-side code and to get readers thinking about selecting a framework for their own development.

The following sections illustrate some points using code fragments taken from real web frameworks. Don't be concerned if it doesn't all make sense now; we'll be working you through the code in our framework-specific modules.
Overview
Server-side web frameworks (a.k.a. "web application frameworks") are software frameworks that make it easier to write, maintain and scale web applications. They provide tools and libraries that simplify common web development tasks, including routing URLs to appropriate handlers, interacting with databases, supporting sessions and user authorization, formatting output (e.g., HTML, JSON, XML), and improving security against web attacks.
The next section provides a bit more detail about how web frameworks can ease web application development. We then explain some of the criteria you can use for choosing a web framework, and then list some of your options.
What can a web framework do for you?
Web frameworks provide tools and libraries to simplify common web development operations. You don't have to use a server-side web framework, but it is strongly advised — it will make your life a lot easier.
This section discusses some of the functionality that is often provided by web frameworks (not every framework will necessarily provide all of these features!).
Work directly with HTTP requests and responses
As we saw in the last article, web servers and browsers communicate via the HTTP protocol — servers wait for HTTP requests from the browser and then return information in HTTP responses. Web frameworks allow you to write simplified syntax that will generate server-side code to work with these requests and responses. This means that you will have an easier job, interacting with easier, higher-level code rather than lower level networking primitives.
The example below shows how this works in the Django (Python) web framework. Every "view" function (a request handler) receives an HttpRequest object containing request information, and is required to return an HttpResponse object with the formatted output (in this case a string).
python
Copy to Clipboard
# Django view function
from django.http import HttpResponse

def index(request):
    # Get an HttpRequest (request)
    # perform operations using information from the request.
    # Return HttpResponse
    return HttpResponse('Output string to return')

Route requests to the appropriate handler
Most sites will provide a number of different resources, accessible through distinct URLs. Handling these all in one function would be hard to maintain, so web frameworks provide simple mechanisms to map URL patterns to specific handler functions. This approach also has benefits in terms of maintenance, because you can change the URL used to deliver a particular feature without having to change the underlying code.
Different frameworks use different mechanisms for the mapping. For example, the Flask (Python) web framework adds routes to view functions using a decorator.
python
Copy to Clipboard
@app.route("/")
def hello():
    return "Hello World!"

While Django expects developers to define a list of URL mappings between a URL pattern and a view function.
python
Copy to Clipboard
urlpatterns = [
    url(r'^$', views.index),
    # example: /best/my_team_name/5/
    url(r'^best/(?P<team_name>\w+?)/(?P<team_number>[0-9]+)/$', views.best),
]

Make it easy to access data in the request
Data can be encoded in an HTTP request in a number of ways. An HTTP GET request to get files or data from the server may encode what data is required in URL parameters or within the URL structure. An HTTP POST request to update a resource on the server will instead include the update information as "POST data" within the body of the request. The HTTP request may also include information about the current session or user in a client-side cookie.
Web frameworks provide programming-language-appropriate mechanisms to access this information. For example, the HttpRequest object that Django passes to every view function contains methods and properties for accessing the target URL, the type of request (e.g., an HTTP GET), GET or POST parameters, cookie and session data, etc. Django can also pass information encoded in the structure of the URL by defining "capture patterns" in the URL mapper (see the last code fragment in the section above).
Abstract and simplify database access
Websites use databases to store information both to be shared with users, and about users. Web frameworks often provide a database layer that abstracts database read, write, query, and delete operations. This abstraction layer is referred to as an Object-Relational Mapper (ORM).
Using an ORM has two benefits:
You can replace the underlying database without necessarily needing to change the code that uses it. This allows developers to optimize for the characteristics of different databases based on their usage.
Basic validation of data can be implemented within the framework. This makes it easier and safer to check that data is stored in the correct type of database field, has the correct format (e.g., an email address), and isn't malicious in any way (hackers can use certain patterns of code to do bad things such as deleting database records).
For example, the Django web framework provides an ORM, and refers to the object used to define the structure of a record as the model. The model specifies the field types to be stored, which may provide field-level validation on what information can be stored (e.g., an email field would only allow valid email addresses). The field definitions may also specify their maximum size, default values, selection list options, help text for documentation, label text for forms etc. The model doesn't state any information about the underlying database as that is a configuration setting that may be changed separately of our code.
The first code snippet below shows a very simple Django model for a Team object. This stores the team name and team level as character fields and specifies a maximum number of characters to be stored for each record. The team_level is a choice field, so we also provide a mapping between choices to be displayed and data to be stored, along with a default value.
python
Copy to Clipboard
#best/models.py

from django.db import models

class Team(models.Model):
    team_name = models.CharField(max_length=40)

    TEAM_LEVELS = (
        ('U09', 'Under 09s'),
        ('U10', 'Under 10s'),
        ('U11', 'Under 11s'),
        # List our other teams
    )
    team_level = models.CharField(max_length=3,choices=TEAM_LEVELS,default='U11')

The Django model provides a simple query API for searching the database. This can match against a number of fields at a time using different criteria (e.g., exact, case-insensitive, greater than, etc.), and can support complex statements (for example, you can specify a search on U11 teams that have a team name that starts with "Fr" or ends with "al").
The second code snippet shows a view function (resource handler) for displaying all of our U09 teams. In this case we specify that we want to filter for all records where the team_level field has exactly the text 'U09' (note below how this criteria is passed to the filter() function as an argument with field name and match type separated by double underscores: team_level__exact).
python
Copy to Clipboard
#best/views.py

from django.shortcuts import render
from .models import Team

def youngest(request):
    list_teams = Team.objects.filter(team_level__exact="U09")
    context = {'youngest_teams': list_teams}
    return render(request, 'best/index.html', context)

Rendering data
Web frameworks often provide templating systems. These allow you to specify the structure of an output document, using placeholders for data that will be added when a page is generated. Templates are often used to create HTML, but can also create other types of documents.
Web frameworks often provide a mechanism to make it easy to generate other formats from stored data, including JSON and XML.
For example, the Django template system allows you to specify variables using a "double-handlebars" syntax (e.g., {{ variable_name }}), which will be replaced by values passed in from the view function when a page is rendered. The template system also provides support for expressions (with syntax: {% expression %}), which allow templates to perform simple operations like iterating list values passed into the template.
Note: Many other templating systems use a similar syntax, e.g.: Jinja2 (Python), handlebars (JavaScript), moustache (JavaScript), etc.
The code snippet below shows how this works. Continuing the "youngest team" example from the previous section, the HTML template is passed a list variable called youngest_teams by the view. Inside the HTML skeleton we have an expression that first checks if the youngest_teams variable exists, and then iterates it in a for loop. On each iteration the template displays the team's team_name value in a list item.
django
Copy to Clipboard
#best/templates/best/index.html

<!doctype html>
<html lang="en">
  <body>
    {% if youngest_teams %}
      <ul>
        {% for team in youngest_teams %}
          <li>{{ team.team_name }}</li>
        {% endfor %}
      </ul>
    {% else %}
      <p>No teams are available.</p>
    {% endif %}
  </body>
</html>

How to select a web framework
Numerous web frameworks exist for almost every programming language you might want to use (we list a few of the more popular frameworks in the following section). With so many choices, it can become difficult to work out what framework provides the best starting point for your new web application.
Some of the factors that may affect your decision are:
Effort to learn: The effort to learn a web framework depends on how familiar you are with the underlying programming language, the consistency of its API, the quality of its documentation, and the size and activity of its community. If you're starting from absolutely no programming experience then consider Django (it is one of the easiest to learn based on the above criteria). If you are part of a development team that already has significant experience with a particular web framework or programming language, then it makes sense to stick with that.
Productivity: Productivity is a measure of how quickly you can create new features once you are familiar with the framework, and includes both the effort to write and maintain code (since you can't write new features while old ones are broken). Many of the factors affecting productivity are similar to those for "Effort to learn" — e.g., documentation, community, programming experience, etc. — other factors include:
Framework purpose/origin: Some web frameworks were initially created to solve certain types of problems, and remain better at creating web apps with similar constraints. For example, Django was created to support development of a newspaper website, so it's good for blogs and other sites that involve publishing things. By contrast, Flask is a much lighter-weight framework and is great for creating web apps running on embedded devices.
Opinionated vs. unopinionated: An opinionated framework is one in which there are recommended "best" ways to solve a particular problem. Opinionated frameworks tend to be more productive when you're trying to solve common problems, because they lead you in the right direction, however they are sometimes less flexible.
Batteries included vs. get it yourself: Some web frameworks include tools/libraries that address every problem their developers can think "by default", while more lightweight frameworks expect web developers to pick and choose solution to problems from separate libraries (Django is an example of the former, while Flask is an example of a very light-weight framework). Frameworks that include everything are often easier to get started with because you already have everything you need, and the chances are that it is well integrated and well documented. However if a smaller framework has everything you (will ever) need then it can run in more constrained environments and will have a smaller and easier subset of things to learn.
Whether or not the framework encourages good development practices: For example, a framework that encourages a Model-View-Controller architecture to separate code into logical functions will result in more maintainable code than one that has no expectations on developers. Similarly, framework design can have a large impact on how easy it is to test and re-use code.
Performance of the framework/programming language: Usually "speed" is not the biggest factor in selection because even relatively slow runtimes like Python are more than "good enough" for mid-sized sites running on moderate hardware. The perceived speed benefits of another language, e.g., C++ or JavaScript, may well be offset by the costs of learning and maintenance.
Caching support: As your website becomes more successful then you may find that it can no longer cope with the number of requests it is receiving as users access it. At this point you may consider adding support for caching. Caching is an optimization where you store all or part of a web response so that it does not have to be recalculated on subsequent requests. Returning a cached response is much faster than calculating one in the first place. Caching can be implemented in your code or in the server (see reverse proxy). Web frameworks will have different levels of support for defining what content can be cached.
Scalability: Once your website is fantastically successful you will exhaust the benefits of caching and even reach the limits of vertical scaling (running your web application on more powerful hardware). At this point you may need to scale horizontally (share the load by distributing your site across a number of web servers and databases) or scale "geographically" because some of your customers are based a long way away from your server. The web framework you choose can make a big difference on how easy it is to scale your site.
Web security: Some web frameworks provide better support for handling common web attacks. Django for example sanitizes all user input from HTML templates so that user-entered JavaScript cannot be run. Other frameworks provide similar protection, but it is not always enabled by default.
There are many other possible factors, including licensing, whether or not the framework is under active development, etc.
If you're an absolute beginner at programming then you'll probably choose your framework based on "ease of learning". In addition to "ease of use" of the language itself, high quality documentation/tutorials and an active community helping new users are your most valuable resources. We've chosen Django (Python) and Express (Node/JavaScript) to write our examples later on in the course, mainly because they are easy to learn and have good support.
Note: Let's go to the main websites for Django (Python) and Express (Node/JavaScript) and check out their documentation and community.
Navigate to the main sites (linked above)
Click on the Documentation menu links (named things like "Documentation, Guide, API Reference, Getting Started", etc.).
Can you see topics showing how to set up URL routing, templates, and databases/models?
Are the documents clear?
Navigate to mailing lists for each site (accessible from Community links).
How many questions have been posted in the last few days
How many have responses?
Do they have an active community?
A few good web frameworks?
Let's now move on, and discuss a few specific server-side web frameworks.
The server-side frameworks below represent a few of the most popular available at the time of writing. All of them have everything you need to be productive — they are open source, are under active development, have enthusiastic communities creating documentation and helping users on discussion boards, and are used in large numbers of high-profile websites. There are many other great server-side frameworks that you can discover using a basic internet search.
Note: Descriptions come (partially) from the framework websites!
Django (Python)
Django is a high-level Python Web framework that encourages rapid development and clean, pragmatic design. Built by experienced developers, it takes care of much of the hassle of web development, so you can focus on writing your app without needing to reinvent the wheel. It's free and open source.
Django follows the "Batteries included" philosophy and provides almost everything most developers might want to do "out of the box". Because everything is included, it all works together, follows consistent design principles, and has extensive and up-to-date documentation. It is also fast, secure, and very scalable. Being based on Python, Django code is easy to read and to maintain.
Popular sites using Django (from Django home page) include: Disqus, Instagram, Knight Foundation, MacArthur Foundation, Mozilla, National Geographic, Open Knowledge Foundation, Pinterest, Open Stack.
Flask (Python)
Flask is a microframework for Python.
While minimalist, Flask can create serious websites out of the box. It contains a development server and debugger, and includes support for Jinja2 templating, secure cookies, unit testing, and RESTful request dispatching. It has good documentation and an active community.
Flask has become extremely popular, particularly for developers who need to provide web services on small, resource-constrained systems (e.g., running a web server on a Raspberry Pi, Drone controllers, etc.)
Express (Node.js/JavaScript)
Express is a fast, unopinionated, flexible and minimalist web framework for Node.js (node is a browserless environment for running JavaScript). It provides a robust set of features for web and mobile applications and delivers useful HTTP utility methods and middleware.
Express is extremely popular, partially because it eases the migration of client-side JavaScript web programmers into server-side development, and partially because it is resource-efficient (the underlying node environment uses lightweight multitasking within a thread rather than spawning separate processes for every new web request).
Because Express is a minimalist web framework it does not incorporate every component that you might want to use (for example, database access and support for users and sessions are provided through independent libraries). There are many excellent independent components, but sometimes it can be hard to work out which is the best for a particular purpose!
Many popular server-side and full stack frameworks (comprising both server and client-side frameworks) are based on Express, including Feathers, ItemsAPI, KeystoneJS, Kraken, LoopBack, MEAN, and Sails.
A lot of high profile companies use Express, including: Uber, Accenture, IBM, etc.
Deno (JavaScript)
Deno is a simple, modern, and secure JavaScript/TypeScript runtime and framework built on top of Chrome V8 and Rust.
Deno is powered by Tokio — a Rust-based asynchronous runtime which lets it serve web pages faster. It also has internal support for WebAssembly, which enables the compilation of binary code for use on the client-side. Deno aims to fill in some of the loop-holes in Node.js by providing a mechanism that naturally maintains better security.
Deno's features include:
Security by default. Deno modules restrict permissions to file, network, or environment access unless explicitly allowed.
TypeScript support out-of-the-box.
First-class await mechanism.
Built-in testing facility and code formatter (deno fmt)
(JavaScript) Browser compatibility: Deno programs that are written completely in JavaScript excluding the Deno namespace (or feature test for it), should work directly in any modern browser.
Script bundling into a single JavaScript file.
Deno provides an easy yet powerful way to use JavaScript for both client- and server-side programming.
Ruby on Rails (Ruby)
Rails (usually referred to as "Ruby on Rails") is a web framework written for the Ruby programming language.
Rails follows a very similar design philosophy to Django. Like Django it provides standard mechanisms for routing URLs, accessing data from a database, generating HTML from templates and formatting data as JSON or XML. It similarly encourages the use of design patterns like DRY ("don't repeat yourself" — write code only once if at all possible), MVC (model-view-controller) and a number of others.
There are of course many differences due to specific design decisions and the nature of the languages.
Rails has been used for high profile sites, including: Basecamp, GitHub, Shopify, Airbnb, Twitch, SoundCloud, Hulu, Zendesk, Square, Highrise.
Laravel (PHP)
Laravel is a web application framework with expressive, elegant syntax. Laravel attempts to take the pain out of development by easing common tasks used in the majority of web projects, such as:
Simple, fast routing engine.
Powerful dependency injection container.
Multiple back-ends for session and cache storage.
Expressive, intuitive database ORM.
Database agnostic schema migrations.
Robust background job processing.
Real-time event broadcasting.
Laravel is accessible, yet powerful, providing tools needed for large, robust applications.
ASP.NET
ASP.NET is an open source web framework developed by Microsoft for building modern web applications and services. With ASP.NET you can quickly create websites based on HTML, CSS, and JavaScript, scale them for use by millions of users and easily add more complex capabilities like Web APIs, forms over data, or real time communications.
One of the differentiators for ASP.NET is that it is built on the Common Language Runtime (CLR), allowing programmers to write ASP.NET code using any supported .NET language (C#, Visual Basic, etc.). Like many Microsoft products it benefits from excellent tools (often free), an active developer community, and well-written documentation.
ASP.NET is used by Microsoft, Xbox.com, Stack Overflow, and many others.
Mojolicious (Perl)
Mojolicious is a next-generation web framework for the Perl programming language.
Back in the early days of the web, many people learned Perl because of a wonderful Perl library called CGI. It was simple enough to get started without knowing much about the language and powerful enough to keep you going. Mojolicious implements this idea using bleeding edge technologies.
Some of the features provided by Mojolicious are:
A real-time web framework, to easily grow single-file prototypes into well-structured MVC web applications.
RESTful routes, plugins, commands, Perl-ish templates, content negotiation, session management, form validation, testing framework, static file server, CGI/PSGI detection, and first-class Unicode support.
A full-stack HTTP and WebSocket client/server implementation with IPv6, TLS, SNI, IDNA, HTTP/SOCKS5 proxy, UNIX domain socket, Comet (long polling), keep-alive, connection pooling, timeout, cookie, multipart, and gzip compression support.
JSON and HTML/XML parsers and generators with CSS selector support.
Very clean, portable and object-oriented pure-Perl API with no hidden magic.
Fresh code based upon years of experience, free and open-source.
Spring Boot (Java)
Spring Boot is one of a number of projects provided by Spring. It is a good starting point for doing server-side web development using Java.
Although definitely not the only framework based on Java it is easy to use to create stand-alone, production-grade Spring-based Applications that you can "just run". It is an opinionated view of the Spring platform and third-party libraries but allows to start with minimum fuss and configuration.
It can be used for small problems but its strength is building larger scale applications that use a cloud approach. Usually multiple applications run in parallel talking to each other, with some providing user interaction and others doing back end work (e.g., accessing databases or other services). Load balancers help to ensure redundancy and reliability or allow geolocated handling of user requests to ensure responsiveness.
Summary
This article has shown that web frameworks can make it easier to develop and maintain server-side code. It has also provided a high level overview of a few popular frameworks, and discussed criteria for choosing a web application framework. You should now have at least an idea of how to choose a web framework for your own server-side development. If not, then don't worry — later on in the course we'll give you detailed tutorials on Django and Express to give you some experience of actually working with a web framework.
For the next article in this module we'll change direction slightly and consider web security.
Website security
Previous


Overview: Server-side website programming first steps


Website security requires vigilance in all aspects of website design and usage. This introductory article won't make you a website security guru, but it will help you understand where threats come from, and what you can do to harden your web application against the most common attacks.
Prerequisites:
Basic computer literacy.
Objective:
To understand the most common threats to web application security and what you can do to reduce the risk of your site being hacked.

What is website security?
The Internet is a dangerous place! With great regularity, we hear about websites becoming unavailable due to denial of service attacks, or displaying modified (and often damaging) information on their homepages. In other high-profile cases, millions of passwords, email addresses, and credit card details have been leaked into the public domain, exposing website users to both personal embarrassment and financial risk.
The purpose of website security is to prevent these (or any) sorts of attacks. The more formal definition of website security is the act/practice of protecting websites from unauthorized access, use, modification, destruction, or disruption.
Effective website security requires design effort across the whole of the website: in your web application, the configuration of the web server, your policies for creating and renewing passwords, and the client-side code. While all that sounds very ominous, the good news is that if you're using a server-side web framework, it will almost certainly enable "by default" robust and well-thought-out defense mechanisms against a number of the more common attacks. Other attacks can be mitigated through your web server configuration, for example by enabling HTTPS. Finally, there are publicly available vulnerability scanner tools that can help you find out if you've made any obvious mistakes.
The rest of this article gives you more details about a few common threats and some of the simple steps you can take to protect your site.
Note: This is an introductory topic, designed to help you start thinking about website security, but it is not exhaustive.
Website security threats
This section lists just a few of the most common website threats and how they are mitigated. As you read, note how threats are most successful when the web application either trusts, or is not paranoid enough about the data coming from the browser.
Cross-Site Scripting (XSS)
XSS is a term used to describe a class of attacks that allow an attacker to inject client-side scripts through the website into the browsers of other users. Because the injected code comes to the browser from the site, the code is trusted and can do things like send the user's site authorization cookie to the attacker. When the attacker has the cookie, they can log into a site as though they were the user and do anything the user can, such as access their credit card details, see contact details, or change passwords.
Note: XSS vulnerabilities have been historically more common than any other type of security threat.
The XSS vulnerabilities are divided into reflected and persistent, based on how the site returns the injected scripts to a browser.
A reflected XSS vulnerability occurs when user content that is passed to the server is returned immediately and unmodified for display in the browser. Any scripts in the original user content will be run when the new page is loaded. For example, consider a site search function where the search terms are encoded as URL parameters, and these terms are displayed along with the results. An attacker can construct a search link that contains a malicious script as a parameter (e.g., https://developer.mozilla.org?q=beer<script%20src="http://example.com/tricky.js"></script>) and email it to another user. If the target user clicks this "interesting link", the script will be executed when the search results are displayed. As discussed earlier, this gives the attacker all the information they need to enter the site as the target user, potentially making purchases as the user or sharing their contact information.
A persistent XSS vulnerability occurs when the malicious script is stored on the website and then later redisplayed unmodified for other users to execute unwittingly. For example, a discussion board that accepts comments that contain unmodified HTML could store a malicious script from an attacker. When the comments are displayed, the script is executed and can send to the attacker the information required to access the user's account. This sort of attack is extremely popular and powerful, because the attacker might not even have any direct engagement with the victims.
While the data from POST or GET requests is the most common source of XSS vulnerabilities, any data from the browser is potentially vulnerable, such as cookie data rendered by the browser, or user files that are uploaded and displayed.
The best defense against XSS vulnerabilities is to remove or disable any markup that can potentially contain instructions to run the code. For HTML this includes elements, such as <script>, <object>, <embed>, and <link>.
The process of modifying user data so that it can't be used to run scripts or otherwise affect the execution of server code is known as input sanitization. Many web frameworks automatically sanitize user input from HTML forms by default.
SQL injection
SQL injection vulnerabilities enable malicious users to execute arbitrary SQL code on a database, allowing data to be accessed, modified, or deleted irrespective of the user's permissions. A successful injection attack might spoof identities, create new identities with administration rights, access all data on the server, or destroy/modify the data to make it unusable.
SQL injection types include Error-based SQL injection, SQL injection based on boolean errors, and Time-based SQL injection.
This vulnerability is present if user input that is passed to an underlying SQL statement can change the meaning of the statement. For example, the following code is intended to list all users with a particular name (userName) that has been supplied from an HTML form:
python
Copy to Clipboard
statement = "SELECT * FROM users WHERE name = '" + userName + "';"

If the user specifies a real name, the statement will work as intended. However, a malicious user could completely change the behavior of this SQL statement to the new statement in the following example, by specifying a';DROP TABLE users; SELECT * FROM userinfo WHERE 't' = 't for the userName.
sql
Copy to Clipboard
SELECT * FROM users WHERE name = 'a';DROP TABLE users; SELECT * FROM userinfo WHERE 't' = 't';

The modified statement creates a valid SQL statement that deletes the users table and selects all data from the userinfo table (which reveals the information of every user). This works because the first part of the injected text (a';) completes the original statement.
To avoid such attacks, the best practice is to use parameterized queries (prepared statements). This approach ensures that the user input is treated as a string of data rather than executable SQL, so that the user cannot abuse special SQL syntax characters to generate unintended SQL statements. The following is an example:
sql
Copy to Clipboard
SELECT * FROM users WHERE name = ? AND password = ?;

When executing the above query, for example, in Python, we pass the name and password as parameters, as shown below.
python
Copy to Clipboard
cursor.execute("SELECT * FROM users WHERE name = ? AND password = ?", (name, password))

Libraries often provide well-abstracted APIs that handle SQL injection protection for the developer, such as Django's models. You can avoid SQL injection by using encapsulated APIs rather than directly writing raw SQL.
Cross-Site Request Forgery (CSRF)
CSRF attacks allow a malicious user to execute actions using the credentials of another user without that user's knowledge or consent.
This type of attack is best explained by example. Josh is a malicious user who knows that a particular site allows logged-in users to send money to a specified account using an HTTP POST request that includes the account name and an amount of money. Josh constructs a form that includes his bank details and an amount of money as hidden fields, and emails it to other site users (with the Submit button disguised as a link to a "get rich quick" site).
If a user clicks the submit button, an HTTP POST request will be sent to the server containing the transaction details and any client-side cookies that the browser associated with the site (adding associated site cookies to requests is normal browser behavior). The server will check the cookies, and use them to determine whether or not the user is logged in and has permission to make the transaction.
The result is that any user who clicks the Submit button while they are logged in to the trading site will make the transaction. Josh gets rich.
Note: The trick here is that Josh doesn't need to have access to the user's cookies (or access credentials). The browser of the user stores this information and automatically includes it in all requests to the associated server.
One way to prevent this type of attack is for the server to require that POST requests include a user-specific site-generated secret. The secret would be supplied by the server when sending the web form used to make transfers. This approach prevents Josh from creating his own form, because he would have to know the secret that the server is providing for the user. Even if he found out the secret and created a form for a particular user, he would no longer be able to use that same form to attack every user.
Web frameworks often include such CSRF prevention mechanisms.
Other threats
Other common attacks/vulnerabilities include:
Clickjacking. In this attack, a malicious user hijacks clicks meant for a visible top-level site and routes them to a hidden page beneath. This technique might be used, for example, to display a legitimate bank site but capture the login credentials into an invisible <iframe> controlled by the attacker. Clickjacking could also be used to get the user to click a button on a visible site, but in doing so actually unwittingly click a completely different button. As a defense, your site can prevent itself from being embedded in an iframe in another site by setting the appropriate HTTP headers.
Denial of Service (DoS). DoS is usually achieved by flooding a target site with fake requests so that access to a site is disrupted for legitimate users. The requests may be numerous, or they may individually consume large amounts of resource (e.g., slow reads or uploading of large files). DoS defenses usually work by identifying and blocking "bad" traffic while allowing legitimate messages through. These defenses are typically located before or in the web server (they are not part of the web application itself).
Directory Traversal (File and disclosure). In this attack, a malicious user attempts to access parts of the web server file system that they should not be able to access. This vulnerability occurs when the user is able to pass filenames that include file system navigation characters (for example, ../../). The solution is to sanitize input before using it.
File Inclusion. In this attack, a user is able to specify an "unintended" file for display or execution in data passed to the server. When loaded, this file might be executed on the web server or the client-side (leading to an XSS attack). The solution is to sanitize input before using it.
Command Injection. Command injection attacks allow a malicious user to execute arbitrary system commands on the host operating system. The solution is to sanitize user input before it might be used in system calls.
For a comprehensive listing of website security threats see Category: Web security exploits (Wikipedia) and Category: Attack (Open Web Application Security Project).
A few key messages
Almost all of the security exploits in the previous sections are successful when the web application trusts data from the browser. Whatever else you do to improve the security of your website, you should sanitize all user-originating data before it is displayed in the browser, used in SQL queries, or passed to an operating system or file system call.
Warning: The single most important lesson you can learn about website security is to never trust data from the browser. This includes, but is not limited to data in URL parameters of GET requests, POST requests, HTTP headers and cookies, and user-uploaded files. Always check and sanitize all incoming data. Always assume the worst.
A number of other concrete steps you can take are:
Use more effective password management. Encourage strong passwords. Consider two-factor authentication for your site, so that in addition to a password the user must enter another authentication code (usually one that is delivered via some physical hardware that only the user will have, such as a code in an SMS sent to their phone).
Configure your web server to use HTTPS and HTTP Strict Transport Security (HSTS). HTTPS encrypts data sent between your client and server. This ensures that login credentials, cookies, POST requests data and header information are not easily available to attackers.
Keep track of the most popular threats (the current OWASP list is here) and address the most common vulnerabilities first.
Use vulnerability scanning tools to perform automated security testing on your site. Later on, your very successful website may also find bugs by offering a bug bounty like Mozilla does here.
Only store and display data that you need. For example, if your users must store sensitive information like credit card details, only display enough of the card number that it can be identified by the user, and not enough that it can be copied by an attacker and used on another site. The most common pattern at this time is to only display the last 4 digits of a credit card number.
Keep software up-to-date. Most servers have regular security updates that fix or mitigate known vulnerabilities. If possible, schedule regular automated updates, and ideally, schedule updates during times when your website has the lowest amount of traffic. It's best to back up your data before updating and test new software versions to make sure there's no compatibility issues on your server.
Web frameworks can help mitigate many of the more common vulnerabilities.
Summary
This article has explained the concept of web security and some of the more common threats against which your website should attempt to protect. Most importantly, you should understand that a web application cannot trust any data from the web browser. All user data should be sanitized before it is displayed, or used in SQL queries and file system calls.
With this article, you've come to the end of this module, covering your first steps in server-side website programming. We hope you've enjoyed learning these fundamental concepts, and you're now ready to select a Web Framework and start programming.
xpress/Node introduction
Overview: Express web framework (Node.js/JavaScript)


Next


In this first Express article we answer the questions "What is Node?" and "What is Express?", and give you an overview of what makes the Express web framework special. We'll outline the main features, and show you some of the main building blocks of an Express application (although at this point you won't yet have a development environment in which to test it).
Prerequisites:
A general understanding of server-side website programming, and in particular the mechanics of client-server interactions in websites.
Objective:
To gain familiarity with what Express is and how it fits in with Node, what functionality it provides, and the main building blocks of an Express application.

Introducing Node
Node (or more formally Node.js) is an open-source, cross-platform runtime environment that allows developers to create all kinds of server-side tools and applications in JavaScript. The runtime is intended for use outside of a browser context (i.e., running directly on a computer or server OS). As such, the environment omits browser-specific JavaScript APIs and adds support for more traditional OS APIs including HTTP and file system libraries.
From a web server development perspective Node has a number of benefits:
Great performance! Node was designed to optimize throughput and scalability in web applications and is a good solution for many common web-development problems (e.g., real-time web applications).
Code is written in "plain old JavaScript", which means that less time is spent dealing with "context shift" between languages when you're writing both client-side and server-side code.
JavaScript is a relatively new programming language and benefits from improvements in language design when compared to other traditional web-server languages (e.g., Python, PHP, etc.) Many other new and popular languages compile/convert into JavaScript so you can also use TypeScript, CoffeeScript, ClojureScript, Scala, LiveScript, etc.
The node package manager (npm) provides access to hundreds of thousands of reusable packages. It also has best-in-class dependency resolution and can also be used to automate most of the build toolchain.
Node.js is portable. It is available on Microsoft Windows, macOS, Linux, Solaris, FreeBSD, OpenBSD, WebOS, and NonStop OS. Furthermore, it is well-supported by many web hosting providers, that often provide specific infrastructure and documentation for hosting Node sites.
It has a very active third party ecosystem and developer community, with lots of people who are willing to help.
You can use Node.js to create a simple web server using the Node HTTP package.
Hello Node.js
The following example creates a web server that listens for any kind of HTTP request on the URL http://127.0.0.1:8000/ — when a request is received, the script will respond with the string: "Hello World". If you have already installed node, you can follow these steps to try out the example:
Open Terminal (on Windows, open the command line utility)
Create the folder where you want to save the program, for example, test-node and then enter it by entering the following command into your terminal:
bash
Copy to Clipboard
cd test-node


Using your favorite text editor, create a file called hello.js and paste the following code into it:
js
Copy to Clipboard
// Load HTTP module
const http = require("http");

const hostname = "127.0.0.1";
const port = 8000;

// Create HTTP server
const server = http.createServer((req, res) => {
  // Set the response HTTP header with HTTP status and Content type
  res.writeHead(200, { "Content-Type": "text/plain" });

  // Send the response body "Hello World"
  res.end("Hello World\n");
});

// Prints a log once the server starts listening
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


Save the file in the folder you created above.
Go back to the terminal and type the following command:
bash
Copy to Clipboard
node hello.js


Finally, navigate to http://localhost:8000 in your web browser; you should see the text "Hello World" in the upper left of an otherwise empty web page.
Note: If you want to play with some Node.js code without having to do any local setup, Scrimba's Aside: The HTTP module MDN learning partner provides an interactive walkthrough of setting up a basic server with the Node HTTP package.
Web Frameworks
Other common web-development tasks are not directly supported by Node itself. If you want to add specific handling for different HTTP verbs (e.g., GET, POST, DELETE, etc.), separately handle requests at different URL paths ("routes"), serve static files, or use templates to dynamically create the response, Node won't be of much use on its own. You will either need to write the code yourself, or you can avoid reinventing the wheel and use a web framework!
Introducing Express
Express is the most popular Node.js web framework, and is the underlying library for a number of other popular Node.js frameworks. It provides mechanisms to:
Write handlers for requests with different HTTP verbs at different URL paths (routes).
Integrate with "view" rendering engines in order to generate responses by inserting data into templates.
Set common web application settings like the port to use for connecting, and the location of templates that are used for rendering the response.
Add additional request processing "middleware" at any point within the request handling pipeline.
While Express itself is fairly minimalist, developers have created compatible middleware packages to address almost any web development problem. There are libraries to work with cookies, sessions, user logins, URL parameters, POST data, security headers, and many more. You can find a list of middleware packages maintained by the Express team at Express Middleware (along with a list of some popular 3rd party packages).
Note: This flexibility is a double edged sword. There are middleware packages to address almost any problem or requirement, but working out the right packages to use can sometimes be a challenge. There is also no "right way" to structure an application, and many examples you might find on the Internet are not optimal, or only show a small part of what you need to do in order to develop a web application.
Where did Node and Express come from?
Node was initially released, for Linux only, in 2009. The npm package manager was released in 2010, and native Windows support was added in 2012. Delve into Wikipedia if you want to know more.
Express was initially released in November 2010 and is currently on major version 5 of the API. You can check out the changelog for information about changes in the current release, and GitHub for more detailed historical release notes.
How popular are Node and Express?
The popularity of a web framework is important because it is an indicator of whether it will continue to be maintained, and what resources are likely to be available in terms of documentation, add-on libraries, and technical support.
There isn't any readily-available and definitive measure of the popularity of server-side frameworks (although you can estimate popularity using mechanisms like counting the number of GitHub projects and Stack Overflow questions for each platform). A better question is whether Node and Express are "popular enough" to avoid the problems of unpopular platforms. Are they continuing to evolve? Can you get help if you need it? Is there an opportunity for you to get paid work if you learn Express?
Based on the number of high profile companies that use Express, the number of people contributing to the codebase, and the number of people providing both free and paid for support, then yes, Express is a popular framework!
Is Express opinionated?
Web frameworks often refer to themselves as "opinionated" or "unopinionated".
Opinionated frameworks are those with opinions about the "right way" to handle any particular task. They often support rapid development in a particular domain (solving problems of a particular type) because the right way to do anything is usually well-understood and well-documented. However they can be less flexible at solving problems outside their main domain, and tend to offer fewer choices for what components and approaches they can use.
Unopinionated frameworks, by contrast, have far fewer restrictions on the best way to glue components together to achieve a goal, or even what components should be used. They make it easier for developers to use the most suitable tools to complete a particular task, albeit at the cost that you need to find those components yourself.
Express is unopinionated. You can insert almost any compatible middleware you like into the request handling chain, in almost any order you like. You can structure the app in one file or multiple files, and using any directory structure. You may sometimes feel that you have too many choices!
What does Express code look like?
In a traditional data-driven website, a web application waits for HTTP requests from the web browser (or other client). When a request is received the application works out what action is needed based on the URL pattern and possibly associated information contained in POST data or GET data. Depending on what is required it may then read or write information from a database or perform other tasks required to satisfy the request. The application will then return a response to the web browser, often dynamically creating an HTML page for the browser to display by inserting the retrieved data into placeholders in an HTML template.
Express provides methods to specify what function is called for a particular HTTP verb (GET, POST, PUT, etc.) and URL pattern ("Route"), and methods to specify what template ("view") engine is used, where template files are located, and what template to use to render a response. You can use Express middleware to add support for cookies, sessions, and users, getting POST/GET parameters, etc. You can use any database mechanism supported by Node (Express does not define any database-related behavior).
The following sections explain some of the common things you'll see when working with Express and Node code.
Helloworld Express
First lets consider the standard Express Hello World example (we discuss each part of this below, and in the following sections).
Note: If you have Node and Express already installed (or if you install them as shown in the next article), you can save this code in a text file called app.js and run it in a bash command prompt by calling:
node ./app.js
js
Copy to Clipboard
const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

The first two lines require() (import) the express module and create an Express application. This object, which is traditionally named app, has methods for routing HTTP requests, configuring middleware, rendering HTML views, registering a template engine, and modifying application settings that control how the application behaves (e.g., the environment mode, whether route definitions are case sensitive, etc.)
The middle part of the code (the three lines starting with app.get) shows a route definition. The app.get() method specifies a callback function that will be invoked whenever there is an HTTP GET request with a path ('/') relative to the site root. The callback function takes a request and a response object as arguments, and calls send() on the response to return the string "Hello World!"
The final block starts up the server on a specified port ('3000') and prints a log comment to the console. With the server running, you could go to localhost:3000 in your browser to see the example response returned.
Importing and creating modules
A module is a JavaScript library/file that you can import into other code using Node's require() function. Express itself is a module, as are the middleware and database libraries that we use in our Express applications.
The code below shows how we import a module by name, using the Express framework as an example. First we invoke the require() function, specifying the name of the module as a string ('express'), and calling the returned object to create an Express application. We can then access the properties and functions of the application object.
js
Copy to Clipboard
const express = require("express");

const app = express();

You can also create your own modules that can be imported in the same way.
Note: You will want to create your own modules, because this allows you to organize your code into manageable parts — a monolithic single-file application is hard to understand and maintain. Using modules also helps you manage your namespace, because only the variables you explicitly export are imported when you use a module.
To make objects available outside of a module you just need to expose them as additional properties on the exports object. For example, the square.js module below is a file that exports area() and perimeter() methods:
js
Copy to Clipboard
exports.area = function (width) {
  return width * width;
};
exports.perimeter = function (width) {
  return 4 * width;
};

We can import this module using require(), and then call the exported method(s) as shown:
js
Copy to Clipboard
const square = require("./square"); // Here we require() the name of the file without the (optional) .js file extension

console.log(`The area of a square with a width of 4 is ${square.area(4)}`);

Note: You can also specify an absolute path to the module (or a name, as we did initially).
If you want to export a complete object in one assignment instead of building it one property at a time, assign it to module.exports as shown below (you can also do this to make the root of the exports object a constructor or other function):
js
Copy to Clipboard
module.exports = {
  area(width) {
    return width * width;
  },

  perimeter(width) {
    return 4 * width;
  },
};

Note: You can think of exports as a shortcut to module.exports within a given module. In fact, exports is just a variable that gets initialized to the value of module.exports before the module is evaluated. That value is a reference to an object (empty object in this case). This means that exports holds a reference to the same object referenced by module.exports. It also means that by assigning another value to exports it's no longer bound to module.exports.
For a lot more information about modules see Modules (Node API docs).
Using asynchronous APIs
JavaScript code frequently uses asynchronous rather than synchronous APIs for operations that may take some time to complete. A synchronous API is one in which each operation must complete before the next operation can start. For example, the following log functions are synchronous, and will print the text to the console in order (First, Second).
js
Copy to Clipboard
console.log("First");
console.log("Second");

By contrast, an asynchronous API is one in which the API will start an operation and immediately return (before the operation is complete). Once the operation finishes, the API will use some mechanism to perform additional operations. For example, the code below will print out "Second, First" because even though setTimeout() method is called first, and returns immediately, the operation doesn't complete for several seconds.
js
Copy to Clipboard
setTimeout(() => {
  console.log("First");
}, 3000);
console.log("Second");

Using non-blocking asynchronous APIs is even more important on Node than in the browser because Node applications are often written as a single-threaded event-driven execution environment. "Single threaded" means that all requests to the server are run on the same thread (rather than being spawned off into separate processes). This model is extremely efficient in terms of speed and server resources. However, it does mean that if any of your functions call synchronous methods that take a long time to complete, they will block not only the current request, but every other request being handled by your web application.
There are multiple ways for an asynchronous API to notify your application that it has completed. Historically, the approach used was to register a callback function when invoking the asynchronous API, which is then called when the operation completes (this is the approach used above).
Note: Using callbacks can be quite "messy" if you have a sequence of dependent asynchronous operations that must be performed in order, because this results in multiple levels of nested callbacks. This problem is commonly known as "callback hell".
Note: A common convention for Node and Express is to use error-first callbacks. In this convention, the first value in your callback functions is an error value, while subsequent arguments contain success data. There is a good explanation of why this approach is useful in this blog: The Node.js Way - Understanding Error-First Callbacks (fredkschott.com).
Modern JavaScript code more commonly uses Promises and async/await to manage asynchronous program flow. You should use promises where possible. If working with code that uses callbacks, you can use the Node.js utils.promisify function to handle the callback → Promise conversion ergonomically.
Creating route handlers
In our Hello World Express example (see above), we defined a (callback) route handler function for HTTP GET requests to the site root ('/').
js
Copy to Clipboard
app.get("/", (req, res) => {
  res.send("Hello World!");
});

The callback function takes a request and a response object as arguments. In this case, the method calls send() on the response to return the string "Hello World!" There are a number of other response methods for ending the request/response cycle, for example, you could call res.json() to send a JSON response or res.sendFile() to send a file.
Note: You can use any argument names you like in the callback functions; when the callback is invoked the first argument will always be the request and the second will always be the response. It makes sense to name them such that you can identify the object you're working with in the body of the callback.
The Express application object also provides methods to define route handlers for all the other HTTP verbs, which are mostly used in exactly the same way:
checkout(), copy(), delete(), get(), head(), lock(), merge(), mkactivity(), mkcol(), move(), m-search(), notify(), options(), patch(), post(), purge(), put(), report(), search(), subscribe(), trace(), unlock(), unsubscribe().
There is a special routing method, app.all(), which will be called in response to any HTTP method. This is used for loading middleware functions at a particular path for all request methods. The following example (from the Express documentation) shows a handler that will be executed for requests to /secret irrespective of the HTTP verb used (provided it is supported by the http module).
js
Copy to Clipboard
app.all("/secret", (req, res, next) => {
  console.log("Accessing the secret section…");
  next(); // pass control to the next handler
});

Routes allow you to match particular patterns of characters in a URL, and extract some values from the URL and pass them as parameters to the route handler (as attributes of the request object passed as a parameter).
Often it is useful to group route handlers for a particular part of a site together and access them using a common route-prefix (e.g., a site with a Wiki might have all wiki-related routes in one file and have them accessed with a route prefix of /wiki/). In Express this is achieved by using the express.Router object. For example, we can create our wiki route in a module named wiki.js, and then export the Router object, as shown below:
js
Copy to Clipboard
// wiki.js - Wiki route module

const express = require("express");

const router = express.Router();

// Home page route
router.get("/", (req, res) => {
  res.send("Wiki home page");
});

// About page route
router.get("/about", (req, res) => {
  res.send("About this wiki");
});

module.exports = router;

Note: Adding routes to the Router object is just like adding routes to the app object (as shown previously).
To use the router in our main app file we would then require() the route module (wiki.js), then call use() on the Express application to add the Router to the middleware handling path. The two routes will then be accessible from /wiki/ and /wiki/about/.
js
Copy to Clipboard
const wiki = require("./wiki.js");

// …
app.use("/wiki", wiki);

We'll show you a lot more about working with routes, and in particular about using the Router, later on in the linked section Routes and controllers.
Using middleware
Middleware is used extensively in Express apps, for tasks from serving static files to error handling, to compressing HTTP responses. Whereas route functions end the HTTP request-response cycle by returning some response to the HTTP client, middleware functions typically perform some operation on the request or response and then call the next function in the "stack", which might be more middleware or a route handler. The order in which middleware is called is up to the app developer.
Note: The middleware can perform any operation, execute any code, make changes to the request and response object, and it can also end the request-response cycle. If it does not end the cycle then it must call next() to pass control to the next middleware function (or the request will be left hanging).
Most apps will use third-party middleware in order to simplify common web development tasks like working with cookies, sessions, user authentication, accessing request POST and JSON data, logging, etc. You can find a list of middleware packages maintained by the Express team (which also includes other popular 3rd party packages). Other Express packages are available on the npm package manager.
To use third party middleware you first need to install it into your app using npm. For example, to install the morgan HTTP request logger middleware, you'd do this:
bash
Copy to Clipboard
npm install morgan

You could then call use() on the Express application object to add the middleware to the stack:
js
Copy to Clipboard
const express = require("express");
const logger = require("morgan");

const app = express();
app.use(logger("dev"));
// …

Note: Middleware and routing functions are called in the order that they are declared. For some middleware the order is important (for example if session middleware depends on cookie middleware, then the cookie handler must be added first). It is almost always the case that middleware is called before setting routes, or your route handlers will not have access to functionality added by your middleware.
You can write your own middleware functions, and you are likely to have to do so (if only to create error handling code). The only difference between a middleware function and a route handler callback is that middleware functions have a third argument next, which middleware functions are expected to call if they are not that which completes the request cycle (when the middleware function is called, this contains the next function that must be called).
You can add a middleware function to the processing chain for all responses with app.use(), or for a specific HTTP verb using the associated method: app.get(), app.post(), etc. Routes are specified in the same way for both cases, though the route is optional when calling app.use().
The example below shows how you can add the middleware function using both approaches, and with/without a route.
js
Copy to Clipboard
const express = require("express");

const app = express();

// An example middleware function
function aMiddlewareFunction(req, res, next) {
  // Perform some operations
  next(); // Call next() so Express will call the next middleware function in the chain.
}

// Function added with use() for all routes and verbs
app.use(aMiddlewareFunction);

// Function added with use() for a specific route
app.use("/some-route", aMiddlewareFunction);

// A middleware function added for a specific HTTP verb and route
app.get("/", aMiddlewareFunction);

app.listen(3000);

Note: Above we declare the middleware function separately and then set it as the callback. In our previous route handler function we declared the callback function when it was used. In JavaScript, either approach is valid.
The Express documentation has a lot more excellent documentation about using and writing Express middleware.
Serving static files
You can use the express.static middleware to serve static files, including your images, CSS and JavaScript (static() is the only middleware function that is actually part of Express). For example, you would use the line below to serve images, CSS files, and JavaScript files from a directory named 'public' at the same level as where you call node:
js
Copy to Clipboard
app.use(express.static("public"));

Any files in the public directory are served by adding their filename (relative to the base "public" directory) to the base URL. So for example:
http://localhost:3000/images/dog.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/app.js
http://localhost:3000/about.html

You can call static() multiple times to serve multiple directories. If a file cannot be found by one middleware function then it will be passed on to the subsequent middleware (the order that middleware is called is based on your declaration order).
js
Copy to Clipboard
app.use(express.static("public"));
app.use(express.static("media"));

You can also create a virtual prefix for your static URLs, rather than having the files added to the base URL. For example, here we specify a mount path so that the files are loaded with the prefix "/media":
js
Copy to Clipboard
app.use("/media", express.static("public"));

Now, you can load the files that are in the public directory from the /media path prefix.
http://localhost:3000/media/images/dog.jpg
http://localhost:3000/media/video/cat.mp4
http://localhost:3000/media/cry.mp3

Note: See also Serving static files in Express.
Handling errors
Errors are handled by one or more special middleware functions that have four arguments, instead of the usual three: (err, req, res, next). For example:
js
Copy to Clipboard
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

These can return any content required, but must be called after all other app.use() and routes calls so that they are the last middleware in the request handling process!
Express comes with a built-in error handler, which takes care of any remaining errors that might be encountered in the app. This default error-handling middleware function is added at the end of the middleware function stack. If you pass an error to next() and you do not handle it in an error handler, it will be handled by the built-in error handler; the error will be written to the client with the stack trace.
Note: The stack trace is not included in the production environment. To run it in production mode you need to set the environment variable NODE_ENV to "production".
Note: HTTP404 and other "error" status codes are not treated as errors. If you want to handle these, you can add a middleware function to do so. For more information see the FAQ.
For more information see Error handling (Express docs).
Using databases
Express apps can use any database mechanism supported by Node (Express itself doesn't define any specific additional behavior/requirements for database management). There are many options, including PostgreSQL, MySQL, Redis, SQLite, MongoDB, etc.
In order to use these you have to first install the database driver using npm. For example, to install the driver for the popular NoSQL MongoDB you would use the command:
bash
Copy to Clipboard
npm install mongodb

The database itself can be installed locally or on a cloud server. In your Express code you import the driver, connect to the database, and then perform create, read, update, and delete (CRUD) operations. The example below (from the Express documentation) shows how you can find "mammal" records using MongoDB (version 3.0 and up):
js
Copy to Clipboard
const { MongoClient } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/animals", (err, client) => {
  if (err) throw err;

  const db = client.db("animals");
  db.collection("mammals")
    .find()
    .toArray((err, result) => {
      if (err) throw err;
      console.log(result);
      client.close();
    });
});

Another popular approach is to access your database indirectly, via an Object Relational Mapper ("ORM"). In this approach you define your data as "objects" or "models" and the ORM maps these through to the underlying database format. This approach has the benefit that as a developer you can continue to think in terms of JavaScript objects rather than database semantics, and that there is an obvious place to perform validation and checking of incoming data. We'll talk more about databases in a later article.
For more information see Database integration (Express docs).
Rendering data (views)
Template engines (also referred to as "view engines" in Express) allow you to specify the structure of an output document in a template, using placeholders for data that will be filled in when a page is generated. Templates are often used to create HTML, but can also create other types of documents.
Express has support for a number of template engines, notably Pug (formerly "Jade"), Mustache, and EJS. Each has its own strengths for addressing particular use cases (relative comparisons can easily be found via Internet search). The Express application generator uses Jade as its default, but it also supports several others.
In your application settings code you set the template engine to use and the location where Express should look for templates using the 'views' and 'view engine' settings, as shown below (you will also have to install the package containing your template library too!)
js
Copy to Clipboard
const express = require("express");
const path = require("path");

const app = express();

// Set directory to contain the templates ('views')
app.set("views", path.join(__dirname, "views"));

// Set view engine to use, in this case 'some_template_engine_name'
app.set("view engine", "some_template_engine_name");

The appearance of the template will depend on what engine you use. Assuming that you have a template file named "index.<template_extension>" that contains placeholders for data variables named 'title' and "message", you would call Response.render() in a route handler function to create and send the HTML response:
js
Copy to Clipboard
app.get("/", (req, res) => {
  res.render("index", { title: "About dogs", message: "Dogs rock!" });
});

For more information see Using template engines with Express (Express docs).
File structure
Express makes no assumptions in terms of structure or what components you use. Routes, views, static files, and other application-specific logic can live in any number of files with any directory structure. While it is perfectly possible to have the whole Express application in one file, typically it makes sense to split your application into files based on function (e.g., account management, blogs, discussion boards) and architectural problem domain (e.g., model, view or controller if you happen to be using an MVC architecture).
In a later topic we'll use the Express Application Generator, which creates a modular app skeleton that we can easily extend for creating web applications.
Summary
Congratulations, you've completed the first step in your Express/Node journey! You should now understand Express and Node's main benefits, and roughly what the main parts of an Express app might look like (routes, middleware, error handling, and template code). You should also understand that with Express being an unopinionated framework, the way you pull these parts together and the libraries that you use are largely up to you!
Of course Express is deliberately a very lightweight web application framework, so much of its benefit and potential comes from third party libraries and features. We'll look at those in more detail in the following articles. In our next article we're going to look at setting up a Node development environment, so that you can start seeing some Express code in action.
See also
Learn Node.js from Scrimba MDN learning partner provides a fun, interactive introduction to Node.js.
Learn Express.js from Scrimba MDN learning partner builds on top of the previous link, showing how to start using the Express framework to build server-side websites.
Modules (Node API docs)
Express (home page)
Basic routing (Express docs)
Routing guide (Express docs)
Using template engines with Express (Express docs)
Using middleware (Express docs)
Writing middleware for use in Express apps (Express docs)
Database integration (Express docs)
Serving static files in Express (Express docs)
Error handling (Express docs)
Overview: Express web framework (Node.js/JavaScript)


Setting up a Node development environment
Previous


Overview: Express web framework (Node.js/JavaScript)


Next


Now that you know what Express is for, we'll show you how to set up and test a Node/Express development environment on Windows, or Linux (Ubuntu), or macOS. For any of those operating systems, this article provides what you need to start developing Express apps.
Prerequisites:
Know how to open a terminal / command line. Know how to install software packages on your development computer's operating system.
Objective:
To set up a development environment for Express on your computer.

Express development environment overview
Node and Express make it very easy to set up your computer in order to start developing web applications. This section provides an overview of what tools are needed, explains some of the simplest methods for installing Node (and Express) on Ubuntu, macOS, and Windows, and shows how you can test your installation.
What is the Express development environment?
The Express development environment includes an installation of Nodejs, the npm package manager, and (optionally) the Express Application Generator on your local computer.
Node and the npm package manager are installed together from prepared binary packages, installers, operating system package managers or from source (as shown in the following sections). Express is then installed by npm as a dependency of your individual Express web applications (along with other libraries like template engines, database drivers, authentication middleware, middleware to serve static files, etc.).
npm can also be used to (globally) install the Express Application Generator, a handy tool for creating skeleton Express web apps that follow the MVC pattern. The application generator is optional because you don't need to use this tool to create apps that use Express, or construct Express apps that have the same architectural layout or dependencies. We'll be using it though, because it makes getting started a lot easier, and promotes a modular application structure.
Note: Unlike some other web frameworks, the development environment does not include a separate development web server. In Node/Express a web application creates and runs its own web server!
There are other peripheral tools that are part of a typical development environment, including text editors or IDEs for editing code, and source control management tools like Git for safely managing different versions of your code. We are assuming that you've already got these sorts of tools installed (in particular a text editor).
What operating systems are supported?
Node can be run on Windows, macOS, many flavors of Linux, Docker, etc. There is a full list on the Node.js Downloads page. Almost any personal computer should have the necessary performance to run Node during development. Express is run in a Node environment, and hence can run on any platform that runs Node.
In this article we provide setup instructions for Windows, macOS, and Ubuntu Linux.
What version of Node/Express should you use?
There are many releases of Node — newer releases contain bug fixes, support for more recent versions of ECMAScript (JavaScript) standards, and improvements to the Node APIs.
Generally you should use the most recent LTS (long-term supported) release as this will be more stable than the "current" release while still having relatively recent features (and is still being actively maintained). You should use the Current release if you need a feature that is not present in the LTS version.
For Express you should use the most recent LTS release of Node.
What about databases and other dependencies?
Other dependencies, such as database drivers, template engines, authentication engines, etc. are part of the application, and are imported into the application environment using the npm package manager. We'll discuss them in later app-specific articles.
Installing Node
In order to use Express you will have to install Nodejs and the Node Package Manager (npm) on your operating system. To make this easier we'll first install a node version manager, and then we'll use it to install the latest Long Term Supported (LTS) versions of node and npm.
Note: You can also install nodejs and npm with installers provide on https://nodejs.org/en/ (select the button to download the LTS build that is "Recommended for most users"), or you can install using the package manager for your OS (nodejs.org). We highly recommend using a node version manager as these make it easier to install, upgrade, and switch between any particular version of node and npm.
Windows
There are a number of node version managers for Windows. Here we use nvm-windows, which is highly respected among node developers.
Install the latest version using your installer of choice from the nvm-windows/releases page. After nvm-windows has installed, open a command prompt (or PowerShell) and enter the following command to download the most recent LTS version of nodejs and npm:
bash
Copy to Clipboard
nvm install lts

At time of writing the LTS version of nodejs is 22.17.0. You can set this as the current version to use with the command below:
bash
Copy to Clipboard
nvm use 22.17.0

Note: If you get "Access Denied" warnings, you will need to run this command in a prompt with administration permissions.
Use the command nvm --help to find out other command line options, such as listing all available node versions, and all downloaded NVM versions.
Ubuntu and macOS
There are a number of node version managers for Ubuntu and macOS. nvm is one of the more popular, and is the original version on which nvm-windows is based. See nvm > Install & Update Script for the terminal instructions to install the latest version of nvm.
After nvm has installed, open a terminal enter the following command to download the most recent LTS version of nodejs and npm:
bash
Copy to Clipboard
nvm install --lts

At the time of writing, the LTS version of nodejs is 22.17.0. The command nvm list shows the downloaded set of version and the current version. You can set a particular version as the current version with the command below (the same as for nvm-windows)
bash
Copy to Clipboard
nvm use 22.17.0

Use the command nvm --help to find out other command line options. These are often similar to, or the same as, those offered by nvm-windows.
Testing your Nodejs and npm installation
Once you have set nvm to use a particular node version, you can test the installation. A good way to do this is to use the "version" command in your terminal/command prompt and check that the expected version string is returned:
bash
Copy to Clipboard
> node -v
v22.17.0

The Nodejs package manager npm should also have been installed, and can be tested in the same way:
bash
Copy to Clipboard
> npm -v
10.9.2

As a slightly more exciting test let's create a very basic "pure node" server that prints out "Hello World" in the browser when you visit the correct URL in your browser:
Copy the following text into a file named hellonode.js. This uses pure Node features (nothing from Express):
js
Copy to Clipboard
// Load HTTP module
const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

// Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {
  // Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
});

// Listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
The code imports the "http" module and uses it to create a server (createServer()) that listens for HTTP requests on port 3000. The script then prints a message to the console about what browser URL you can use to test the server. The createServer() function takes as an argument a callback function that will be invoked when an HTTP request is received — this returns a response with an HTTP status code of 200 ("OK") and the plain text "Hello World".
Note: Don't worry if you don't understand exactly what this code is doing yet! We'll explain our code in greater detail once we start using Express!
Start the server by navigating into the same directory as your hellonode.js file in your command prompt, and calling node along with the script name, like so:
bash
Copy to Clipboard
node hellonode.js
Once the server starts, you will see console output indicating the IP address the server is running on:
Server running at http://127.0.0.1:3000/


Navigate to the URL http://127.0.0.1:3000. If everything is working, the browser should display the string "Hello World".
Using npm
Next to Node itself, npm is the most important tool for working with Node applications. npm is used to fetch any packages (JavaScript libraries) that an application needs for development, testing, and/or production, and may also be used to run tests and tools used in the development process.
Note: From Node's perspective, Express is just another package that you need to install using npm and then require in your own code.
You can manually use npm to separately fetch each needed package. Typically we instead manage dependencies using a plain-text definition file named package.json. This file lists all the dependencies for a specific JavaScript "package", including the package's name, version, description, initial file to execute, production dependencies, development dependencies, versions of Node it can work with, etc. The package.json file should contain everything npm needs to fetch and run your application (if you were writing a reusable library you could use this definition to upload your package to the npm repository and make it available for other users).
Adding dependencies
The following steps show how you can use npm to download a package, save it into the project dependencies, and then require it in a Node application.
Note: Here we show the instructions to fetch and install the Express package. Later on we'll show how this package, and others, are already specified for us using the Express Application Generator. This section is provided because it is useful to understand how npm works and what is being created by the application generator.
First create a directory for your new application and navigate into it:
bash
Copy to Clipboard
mkdir myapp
cd myapp


Use the npm init command to create a package.json file for your application. This command prompts you for a number of things, including the name and version of your application and the name of the initial entry point file (by default this is index.js). For now, just accept the defaults:
bash
Copy to Clipboard
npm init
If you display the package.json file (cat package.json), you will see the defaults that you accepted, ending with the license.
json
Copy to Clipboard
{
  "name": "myapp",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": ""
}


Now install Express in the myapp directory and save it in the dependencies list of your package.json file:
bash
Copy to Clipboard
npm install express
The dependencies section of your package.json will now appear at the end of the package.json file and will include Express.
json
Copy to Clipboard
{
  "name": "myapp",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^5.1.0"
  }
}


To use the Express library you call the require() function in your index.js file to include it in your application. Create this file now, in the root of the "myapp" application directory, and give it the following contents:
js
Copy to Clipboard
const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
This code shows a minimal "HelloWorld" Express web application. This imports the "express" module using require() and uses it to create a server (app) that listens for HTTP requests on port 3000 and prints a message to the console explaining what browser URL you can use to test the server. The app.get() function only responds to HTTP GET requests with the specified URL path ('/'), in this case by calling a function to send our Hello World! message.
Note: The backticks in the `Example app listening on port ${port}!` let us interpolate the value of $port into the string.
You can start the server by calling node with the script in your command prompt:
bash
Copy to Clipboard
node index.js
You will see the following console output:
Example app listening on port 3000


Navigate to the URL http://localhost:3000/. If everything is working, the browser should display the string "Hello World!".
Development dependencies
If a dependency is only used during development, you should instead save it as a "development dependency" (so that your package users don't have to install it in production). For example, to use the popular JavaScript Linting tool ESLint you would call npm as shown:
bash
Copy to Clipboard
npm install eslint --save-dev

The following entry would then be added to your application's package.json:
json
Copy to Clipboard
"devDependencies": {
  "eslint": "^9.30.1"
}

Note: "Linters" are tools that perform static analysis on software in order to recognize and report adherence/non-adherence to some set of coding best practice.
Running tasks
In addition to defining and fetching dependencies you can also define named scripts in your package.json files and call npm to execute them with the run-script command. This approach is commonly used to automate running tests and parts of the development or build toolchain (e.g., running tools to minify JavaScript, shrink images, LINT/analyze your code, etc.).
Note: Task runners like Gulp and Grunt can also be used to run tests and other external tools.
For example, to define a script to run the eslint development dependency that we specified in the previous section we might add the following script block to our package.json file (assuming that our application source is in a folder /src/js):
json
Copy to Clipboard
"scripts": {
  // …
  "lint": "eslint src/js"
  // …
}

To explain a little further, eslint src/js is a command that we could enter in our terminal/command line to run eslint on JavaScript files contained in the src/js directory inside our app directory. Including the above inside our app's package.json file provides a shortcut for this command — lint.
We would then be able to run eslint using npm by calling:
bash
Copy to Clipboard
npm run-script lint
# OR (using the alias)
npm run lint

This example may not look any shorter than the original command, but you can include much bigger commands inside your npm scripts, including chains of multiple commands. You could identify a single npm script that runs all your tests at once.
Installing the Express Application Generator
The Express Application Generator tool generates an Express application "skeleton". Install the generator using npm as shown:
bash
Copy to Clipboard
npm install express-generator -g

Note: You may need to prefix this line with sudo on Ubuntu or macOS. The -g flag installs the tool globally so that you can call it from anywhere.
To create an Express app named "helloworld" with the default settings, navigate to where you want to create it and run the app as shown:
bash
Copy to Clipboard
express helloworld

Note: Unless you're using an old nodejs version (< 8.2.0), you could alternatively skip the installation and run express-generator with npx. This has the same effect as installing and then running express-generator but does not install the package on your system:
bash
Copy to Clipboard
npx express-generator helloworld

You can also specify the template library to use and a number of other settings. Use the help command to see all the options:
bash
Copy to Clipboard
express --help

The generator will create the new Express app in a sub folder of your current location, displaying build progress on the console. On completion, the tool will display the commands you need to enter to install the Node dependencies and start the app.
The new app will have a package.json file in its root directory. You can open this to see what dependencies are installed, including Express and the template library Jade:
json
Copy to Clipboard
{
  "name": "helloworld",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "jade": "~1.11.0",
    "morgan": "~1.9.1"
  }
}

Install all the dependencies for the helloworld app using npm as shown:
bash
Copy to Clipboard
cd helloworld
npm install

Then run the app (the commands are slightly different for Windows and Linux/macOS), as shown below:
bash
Copy to Clipboard
# Run helloworld on Windows with Command Prompt
SET DEBUG=helloworld:* & npm start

# Run helloworld on Windows with PowerShell
SET DEBUG=helloworld:* | npm start

# Run helloworld on Linux/macOS
DEBUG=helloworld:* npm start

The DEBUG command creates useful logging, resulting in an output like the following:
bash
Copy to Clipboard
>SET DEBUG=helloworld:* & npm start

> helloworld@0.0.0 start D:\GitHub\express-tests\helloworld
> node ./bin/www

  helloworld:server Listening on port 3000 +0ms

Open a browser and navigate to http://localhost:3000/ to see the default Express welcome page.

We'll talk more about the generated app when we get to the article on generating a skeleton application.
Summary
You now have a Node development environment up and running on your computer that can be used for creating Express web applications. You've also seen how npm can be used to import Express into an application, and also how you can create applications using the Express Application Generator tool and then run them.
In the next article we start working through a tutorial to build a complete web application using this environment and associated tools.
See also
Downloads page (nodejs.org)
Installing Express (expressjs.com)
Express Application Generator (expressjs.com)
Using Node.js with Windows subsystem for Linux (docs.microsoft.com)
Previous


Overview: Express web framework (Node.js/JavaScript)


Next


Express Tutorial: The Local Library website
Previous


Overview: Express web framework (Node.js/JavaScript)


Next


This article is an overview of the MDN Express tutorial and introduces the "local library" example website we'll be using throughout the next few pages. You'll find out what the tutorial covers, how to get started, how to ask for help, and everything else you need to build and deploy your first server-side JavaScript app.
Prerequisites:
Read the Express Introduction. For the following articles you'll also need to have set up a Node development environment.
Objective:
To introduce the example application used in this tutorial, and allow readers to understand what topics will be covered.

Overview
Welcome to the MDN "Local Library" Express (Node) tutorial, in which we develop a website that might be used to manage the catalog for a local library.
In this series of tutorial articles you will:
Use the Express Application Generator tool to create a skeleton website and application.
Start and stop the Node web server.
Use a database to store your application's data.
Create routes for requesting different information, and templates ("views") to render the data as HTML to be displayed in the browser.
Work with forms.
Deploy your application to production.
You have learnt about some of these topics already, and touched briefly on others. By the end of the tutorial series you should know enough to develop simple Express apps by yourself.
The LocalLibrary website
LocalLibrary is the name of the website that we'll create and evolve over the course of this series of tutorials. As you'd expect, the purpose of the website is to provide an online catalog for a small local library, where users can browse available books and manage their accounts.
This example has been carefully chosen because it can scale to show as much or little detail as we need, and can be used to show off almost any Express feature. More importantly, it allows us to provide a guided path through the functionality you'll need in any website:
In the first few tutorial articles we will define a simple browse-only library that library members can use to find out what books are available. This allows us to explore the operations that are common to almost every website: reading and displaying content from a database.
As we progress, the library example naturally extends to demonstrate more advanced website features. For example we can extend the library to allow new books to be created, and use this to demonstrate how to use forms and support user authentication.
Even though this is a very extensible example, it's called LocalLibrary for a reason — we're hoping to show the minimum information that will help you get up and running with Express quickly. As a result we'll store information about books, copies of books, authors and other key information. We won't however be storing information about other items a library might lend, or provide the infrastructure needed to support multiple library sites or other "big library" features.
I'm stuck, where can I get the source?
As you work through the tutorial we'll provide the appropriate code snippets for you to copy and paste at each point, and there will be other code that we hope you'll extend yourself (with some guidance).
Instead of copying and pasting all the code snippets, try typing them out, It'll benefit you in the long run as you'll be more familiar with the code next time you come to write something similar.
If you get stuck, you can find the fully developed version of the website on GitHub here.
Note: The specific versions of node, Express, and the other modules that this documentation was tested against are listed in the project package.json.
Summary
Now that you know a bit more about the LocalLibrary website and what you're going to learn, it's time to start creating a skeleton project to contain our example.
Express Tutorial Part 2: Creating a skeleton website
Previous


Overview: Express web framework (Node.js/JavaScript)


Next


This second article in our Express Tutorial shows how you can create a "skeleton" website project which you can then go on to populate with site-specific routes, templates/views, and database calls.
Prerequisites:
Set up a Node development environment. Review the Express Tutorial.
Objective:
To be able to start your own new website projects using the Express Application Generator.

Overview
This article shows how you can create a "skeleton" website using the Express Application Generator tool, which you can then populate with site-specific routes, views/templates, and database calls. In this case, we'll use the tool to create the framework for our Local Library website, to which we'll later add all the other code needed by the site. The process is extremely simple, requiring only that you invoke the generator on the command line with a new project name, optionally also specifying the site's template engine and CSS generator.
The following sections show you how to call the application generator, and provides a little explanation about the different view/CSS options. We'll also explain how the skeleton website is structured. At the end, we'll show how you can run the website to verify that it works.
Note:
The Express Application Generator is not the only generator for Express applications, and the generated project is not the only viable way to structure your files and directories. The generated site does however have a modular structure that is easy to extend and understand. For information about a minimal Express application, see Hello world example (Express docs).
The Express Application Generator declares most variables using var. We have changed most of these to const (and a few to let) in the tutorial, because we want to demonstrate modern JavaScript practice.
This tutorial uses the version of Express and other dependencies that are defined in the package.json created by the Express Application Generator. These are not (necessarily) the latest version, and you should update them when deploying a real application to production.
Using the application generator
You should already have installed the generator as part of setting up a Node development environment. As a quick reminder, you install the generator tool site-wide using the npm package manager, as shown:
bash
Copy to Clipboard
npm install express-generator -g

The generator has a number of options, which you can view on the command line using the --help (or -h) command:
bash
Copy to Clipboard
> express --help

    Usage: express [options] [dir]

  Options:

        --version        output the version number
    -e, --ejs            add ejs engine support
        --pug            add pug engine support
        --hbs            add handlebars engine support
    -H, --hogan          add hogan.js engine support
    -v, --view <engine>  add view <engine> support (dust|ejs|hbs|hjs|jade|pug|twig|vash) (defaults to jade)
        --no-view        use static html instead of view engine
    -c, --css <engine>   add stylesheet <engine> support (less|stylus|compass|sass) (defaults to plain CSS)
        --git            add .gitignore
    -f, --force          force on non-empty directory
    -h, --help           output usage information

You can specify express to create a project inside the current directory using the Jade view engine and plain CSS (if you specify a directory name then the project will be created in a sub-folder with that name).
bash
Copy to Clipboard
express

You can also choose a view (template) engine using --view and/or a CSS generation engine using --css.
Note: The other options for choosing template engines (e.g., --hogan, --ejs, --hbs etc.) are deprecated. Use --view (or -v).
What view engine should I use?
The Express Application Generator allows you to configure a number of popular view/templating engines, including EJS, Hbs, Pug (Jade), Twig, and Vash, although it chooses Jade by default if you don't specify a view option. Express itself can also support a large number of other templating languages out of the box.
Note: If you want to use a template engine that isn't supported by the generator then see Using template engines with Express (Express docs) and the documentation for your target view engine.
Generally speaking, you should select a templating engine that delivers all the functionality you need and allows you to be productive sooner — or in other words, in the same way that you choose any other component! Some of the things to consider when comparing template engines:
Time to productivity — If your team already has experience with a templating language then it is likely they will be productive faster using that language. If not, then you should consider the relative learning curve for candidate templating engines.
Popularity and activity — Review the popularity of the engine and whether it has an active community. It is important to be able to get support when problems arise throughout the lifetime of the website.
Style — Some template engines use specific markup to indicate inserted content within "ordinary" HTML, while others construct the HTML using a different syntax (for example, using indentation and block names).
Performance/rendering time.
Features — you should consider whether the engines you look at have the following features available:
Layout inheritance: Allows you to define a base template and then "inherit" just the parts of it that you want to be different for a particular page. This is typically a better approach than building templates by including a number of required components or building a template from scratch each time.
"Include" support: Allows you to build up templates by including other templates.
Concise variable and loop control syntax.
Ability to filter variable values at template level, such as making variables upper-case, or formatting a date value.
Ability to generate output formats other than HTML, such as JSON or XML.
Support for asynchronous operations and streaming.
Client-side features. If a templating engine can be used on the client this allows the possibility of having all or most of the rendering done client-side.
Note: There are many resources on the Internet to help you compare the different options!
For this project, we'll use the Pug templating engine (previously called "Jade"), as this is one of the most popular Express/JavaScript templating languages and is supported out of the box by the generator.
What CSS stylesheet engine should I use?
The Express Application Generator allows you to create a project that is configured to use the most common CSS stylesheet engines: LESS, SASS, Stylus.
Note: CSS has some limitations that make certain tasks difficult. CSS stylesheet engines allow you to use more powerful syntax for defining your CSS and then compile the definition into plain-old CSS for browsers to use.
As with templating engines, you should use the stylesheet engine that will allow your team to be most productive. For this project, we'll use vanilla CSS (the default) as our CSS requirements are not sufficiently complicated to justify using anything else.
What database should I use?
The generated code doesn't use/include any databases. Express apps can use any database mechanism supported by Node (Express itself doesn't define any specific additional behavior/requirements for database management).
We'll discuss how to integrate with a database in a later article.
Creating the project
For the sample Local Library app we're going to build, we'll create a project named express-locallibrary-tutorial using the Pug template library and no CSS engine.
First, navigate to where you want to create the project and then run the Express Application Generator in the command prompt as shown:
bash
Copy to Clipboard
express express-locallibrary-tutorial --view=pug

The generator will create (and list) the project's files.
  create : express-locallibrary-tutorial\
   create : express-locallibrary-tutorial\public\
   create : express-locallibrary-tutorial\public\javascripts\
   create : express-locallibrary-tutorial\public\images\
   create : express-locallibrary-tutorial\public\stylesheets\
   create : express-locallibrary-tutorial\public\stylesheets\style.css
   create : express-locallibrary-tutorial\routes\
   create : express-locallibrary-tutorial\routes\index.js
   create : express-locallibrary-tutorial\routes\users.js
   create : express-locallibrary-tutorial\views\
   create : express-locallibrary-tutorial\views\error.pug
   create : express-locallibrary-tutorial\views\index.pug
   create : express-locallibrary-tutorial\views\layout.pug
   create : express-locallibrary-tutorial\app.js
   create : express-locallibrary-tutorial\package.json
   create : express-locallibrary-tutorial\bin\
   create : express-locallibrary-tutorial\bin\www

   change directory:
     > cd express-locallibrary-tutorial

   install dependencies:
     > npm install

   run the app (Bash (Linux or macOS))
     > DEBUG=express-locallibrary-tutorial:* npm start

   run the app (PowerShell (Windows))
     > $env:DEBUG = "express-locallibrary-tutorial:*"; npm start

   run the app (Command Prompt (Windows)):
     > SET DEBUG=express-locallibrary-tutorial:* & npm start

At the end of the output, the generator provides instructions on how to install the dependencies (as listed in the package.json file) and how to run the application on different operating systems.
Note: The generator-created files define all variables as var. Open all of the generated files and change the var declarations to const before you continue (the remainder of the tutorial assumes that you have done so).
Running the skeleton website
At this point, we have a complete skeleton project. The website doesn't actually do very much yet, but it's worth running it to show that it works.
First, install the dependencies (the install command will fetch all the dependency packages listed in the project's package.json file).
bash
Copy to Clipboard
cd express-locallibrary-tutorial
npm install


Then run the application.
On the Windows CMD prompt, use this command:
batch
Copy to Clipboard
SET DEBUG=express-locallibrary-tutorial:* & npm start


On Windows PowerShell, use this command:
powershell
Copy to Clipboard
$env:DEBUG = "express-locallibrary-tutorial:*"; npm start
Note: PowerShell commands are not covered in this tutorial (The provided "Windows" commands assume you're using the Windows CMD prompt.)
On macOS or Linux, use this command:
bash
Copy to Clipboard
DEBUG=express-locallibrary-tutorial:* npm start


Then load http://localhost:3000/ in your browser to access the app.
You should see a browser page that looks like this:

Congratulations! You now have a working Express application that can be accessed via port 3000.
Note: You could also start the app just using the npm start command. Specifying the DEBUG variable as shown enables console logging/debugging. For example, when you visit the above page you'll see debug output like this:
bash
Copy to Clipboard
SET DEBUG=express-locallibrary-tutorial:* & npm start

> express-locallibrary-tutorial@0.0.0 start D:\github\mdn\test\exprgen\express-locallibrary-tutorial
> node ./bin/www

  express-locallibrary-tutorial:server Listening on port 3000 +0ms
GET / 304 490.296 ms - -
GET /stylesheets/style.css 200 4.886 ms - 111

Enable server restart on file changes
Any changes you make to your Express website are currently not visible until you restart the server. It quickly becomes very irritating to have to stop and restart your server every time you make a change, so it is worth taking the time to automate restarting the server when needed.
A convenient tool for this purpose is nodemon. This is usually installed globally (as it is a "tool"), but here we'll install and use it locally as a developer dependency, so that any developers working with the project get it automatically when they install the application. Use the following command in the root directory for the skeleton project:
bash
Copy to Clipboard
npm install --save-dev nodemon

If you still choose to install nodemon globally to your machine, and not only to your project's package.json file:
bash
Copy to Clipboard
npm install -g nodemon

If you open your project's package.json file you'll now see a new section with this dependency:
json
Copy to Clipboard
"devDependencies": {
    "nodemon": "^3.1.10"
}

Because the tool isn't installed globally, we can't launch it from the command line (unless we add it to the path). However, we can call it from an npm script because npm knows which packages are installed. Find the scripts section of your package.json. Initially, it will contain one line, which begins with "start". Update it by putting a comma at the end of that line, and adding the "devstart" and "serverstart" lines:
On Linux and macOS, the scripts section will look like this:
json
Copy to Clipboard
 "scripts": {
    "start": "node ./bin/www",
    "devstart": "nodemon ./bin/www",
    "serverstart": "DEBUG=express-locallibrary-tutorial:* npm run devstart"
  },


On Windows, the "serverstart" value would instead look like this (if using the command prompt):
bash
Copy to Clipboard
"serverstart": "SET DEBUG=express-locallibrary-tutorial:* & npm run devstart"


We can now start the server in almost exactly the same way as previously, but using the devstart command.
Note: Now if you edit any file in the project the server will restart (or you can restart it by typing rs on the command prompt at any time). You will still need to reload the browser to refresh the page.
We now have to call npm run <script-name> rather than just npm start, because "start" is actually an npm command that is mapped to the named script. We could have replaced the command in the start script but we only want to use nodemon during development, so it makes sense to create a new script command.
The serverstart command added to the scripts in the package.json above is a very good example. Using this approach means you no longer have to type a long command to start the server. Note that the particular command added to the script works for macOS or Linux only.
The generated project
Let's now take a look at the project we just created. We'll be making some minor modifications to this as we go along.
Directory structure
The generated project, now that you have installed dependencies, has the following file structure (files are the items not prefixed with "/"). The package.json file defines the application dependencies and other information. It also defines a startup script that will call the application entry point, the JavaScript file /bin/www. This sets up some of the application error handling and then loads app.js to do the rest of the work. The app routes are stored in separate modules under the routes/ directory. The templates are stored under the /views directory.
express-locallibrary-tutorial
    app.js
    /bin
        www
    package.json
    package-lock.json
    /node_modules
        [about 6700 subdirectories and files]
    /public
        /images
        /javascripts
        /stylesheets
            style.css
    /routes
        index.js
        users.js
    /views
        error.pug
        index.pug
        layout.pug

The following sections describe the files in a little more detail.
package.json
The package.json file defines the application dependencies and other information:
json
Copy to Clipboard
{
  "name": "express-locallibrary-tutorial",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "morgan": "~1.9.1",
    "pug": "2.0.0-beta11"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}

The scripts section first defines a "start" script, which is what we are invoking when we call npm start to start the server (this script was added by the Express Application Generator). From the script definition, you can see that this actually starts the JavaScript file ./bin/www with node.
We already modified this section in Enable server restart on file changes by adding the devstart and serverstart scripts. These can be used to start the same ./bin/www file with nodemon rather than node (this version of the scripts is for Linux and macOS, as discussed above).
json
Copy to Clipboard
 "scripts": {
    "start": "node ./bin/www",
    "devstart": "nodemon ./bin/www",
    "serverstart": "DEBUG=express-locallibrary-tutorial:* npm run devstart"
  },

The dependencies include the express package and the package for our selected view engine (pug). In addition, we have the following packages that are useful in many web applications:
cookie-parser: Used to parse the cookie header and populate req.cookies (essentially provides a convenient method for accessing cookie information).
debug: A tiny node debugging utility modeled after node core's debugging technique.
morgan: An HTTP request logger middleware for node.
http-errors: Create HTTP errors where needed (for express error handling).
The default versions in the generated project are a little out of date. Replace the dependencies section of your package.json file with the following text, which specifies the latest versions of these libraries at the time of writing:
json
Copy to Clipboard
 "dependencies": {
    "cookie-parser": "^1.4.7",
    "debug": "^4.4.1",
    "express": "^5.1.0",
    "http-errors": "~2.0.0",
    "morgan": "^1.10.0",
    "pug": "3.0.3"
  },

Then update your installed dependencies using the command:
bash
Copy to Clipboard
npm install

Note: It is a good idea to regularly update to the latest compatible versions of your dependency libraries — this may even be done automatically or semi-automatically as part of a continuous integration setup.
Usually library updates to the minor and patch version remain compatible. We've prefixed each version with ^ above so that we can automatically update to the latest minor.patch version by running:
bash
Copy to Clipboard
npm update --save

Major versions change the compatibility. For those updates we'll need to manually update the package.json and code that uses the library, and extensively re-test the project.
www file
The file /bin/www is the application entry point! The very first thing this does is require() the "real" application entry point (app.js, in the project root) that sets up and returns the express() application object. require() is the CommonJS way to import JavaScript code, JSON, and other files into the current file. Here we specify app.js module using a relative path and omit the optional (.js) file extension.
js
Copy to Clipboard
#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require("../app");

Note: Node.js 14 and later support ES6 import statements for importing JavaScript (ECMAScript) modules. To use this feature you have to add "type": "module" to your Express package.json file, all the modules in your application have to use import rather than require(), and for relative imports you must include the file extension (for more information see the Node documentation). While there are benefits to using import, this tutorial uses require() in order to match the Express documentation.
The remainder of the code in this file sets up a node HTTP server with app set to a specific port (defined in an environment variable or 3000 if the variable isn't defined), and starts listening and reporting server errors and connections. For now you don't really need to know anything else about the code (everything in this file is "boilerplate"), but feel free to review it if you're interested.
app.js
This file creates an express application object (named app, by convention), sets up the application with various settings and middleware, and then exports the app from the module. The code below shows just the parts of the file that create and export the app object:
js
Copy to Clipboard
const express = require("express");

const app = express();
// …
module.exports = app;

Back in the www entry point file above, it is this module.exports object that is supplied to the caller when this file is imported.
Let's work through the app.js file in detail. First, we import some useful node libraries into the file using require(), including http-errors, express, morgan and cookie-parser that we previously downloaded for our application using npm; and path, which is a core Node library for parsing file and directory paths.
js
Copy to Clipboard
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

Then we require() modules from our routes directory. These modules/files contain code for handling particular sets of related "routes" (URL paths). When we extend the skeleton application, for example to list all books in the library, we will add a new file for dealing with book-related routes.
js
Copy to Clipboard
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

Note: At this point, we have just imported the module; we haven't actually used its routes yet (this happens just a little bit further down the file).
Next, we create the app object using our imported express module, and then use it to set up the view (template) engine. There are two parts to setting up the engine. First, we set the "views" value to specify the folder where the templates will be stored (in this case the subfolder /views). Then we set the "view engine" value to specify the template library (in this case "pug").
js
Copy to Clipboard
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

The next set of functions call app.use() to add the middleware libraries that we imported above into the request handling chain. For example, express.json() and express.urlencoded() are needed to populate req.body with the form fields. After these libraries we also use the express.static middleware, which makes Express serve all the static files in the /public directory in the project root.
js
Copy to Clipboard
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

Now that all the other middleware is set up, we add our (previously imported) route-handling code to the request handling chain. The imported code will define particular routes for the different parts of the site:
js
Copy to Clipboard
app.use("/", indexRouter);
app.use("/users", usersRouter);

Note: The paths specified above ("/" and "/users") are treated as a prefix to routes defined in the imported files. So for example, if the imported users module defines a route for /profile, you would access that route at /users/profile. We'll talk more about routes in a later article.
The last middleware in the file adds handler methods for errors and HTTP 404 responses.
js
Copy to Clipboard
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

The Express application object (app) is now fully configured. The last step is to add it to the module exports (this is what allows it to be imported by /bin/www).
js
Copy to Clipboard
module.exports = app;

Routes
The route file /routes/users.js is shown below (route files share a similar structure, so we don't need to also show index.js). First, it loads the express module and uses it to get an express.Router object. Then it specifies a route on that object and lastly exports the router from the module (this is what allows the file to be imported into app.js).
js
Copy to Clipboard
const express = require("express");

const router = express.Router();

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

module.exports = router;

The route defines a callback that will be invoked whenever an HTTP GET request with the correct pattern is detected. The matching pattern is the route specified when the module is imported ("/users") plus whatever is defined in this file ("/"). In other words, this route will be used when a URL of /users/ is received.
Note: Try this out by running the server with node and visiting the URL in your browser: http://localhost:3000/users/. You should see a message: 'respond with a resource'.
One thing of interest above is that the callback function has the third argument next, and is hence a middleware function rather than a simple route callback. While the code doesn't currently use the next argument, it may be useful in the future if you want to add multiple route handlers to the '/' route path.
Views (templates)
The views (templates) are stored in the /views directory (as specified in app.js) and are given the file extension .pug. The method Response.render() is used to render a specified template along with the values of named variables passed in an object, and then send the result as a response. In the code below from /routes/index.js you can see how that route renders a response using the template "index" passing the template variable "title".
js
Copy to Clipboard
/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

The corresponding template for the above route is given below (index.pug). We'll talk more about the syntax later. All you need to know for now is that the title variable (with value 'Express') is inserted where specified in the template.
pug
Copy to Clipboard
extends layout

block content
  h1= title
  p Welcome to #{title}

Challenge yourself
Create a new route in /routes/users.js that will display the text "You're so cool" at URL /users/cool/. Test it by running the server and visiting http://localhost:3000/users/cool/ in your browser
Summary
You have now created a skeleton website project for the Local Library and verified that it runs using node. Most importantly, you also understand how the project is structured, so you have a good idea where we need to make changes to add routes and views for our local library.
Next, we'll start modifying the skeleton so that it works as a library website.
Express Tutorial Part 3: Using a Database (with Mongoose)
Previous


Overview: Express web framework (Node.js/JavaScript)


Next


This article briefly introduces databases, and how to use them with Node/Express apps. It then goes on to show how we can use Mongoose to provide database access for the LocalLibrary website. It explains how object schema and models are declared, the main field types, and basic validation. It also briefly shows a few of the main ways in which you can access model data.
Prerequisites:
Express Tutorial Part 2: Creating a skeleton website
Objective:
To be able to design and create your own models using Mongoose.

Overview
Library staff will use the Local Library website to store information about books and borrowers, while library members will use it to browse and search for books, find out whether there are any copies available, and then reserve or borrow them. In order to store and retrieve information efficiently, we will store it in a database.
Express apps can use many different databases, and there are several approaches you can use for performing Create, Read, Update and Delete (CRUD) operations. This tutorial provides a brief overview of some of the available options and then goes on to show in detail the particular mechanisms selected.
What databases can I use?
Express apps can use any database supported by Node (Express itself doesn't define any specific additional behavior/requirements for database management). There are many popular options, including PostgreSQL, MySQL, Redis, SQLite, and MongoDB.
When choosing a database, you should consider things like time-to-productivity/learning curve, performance, ease of replication/backup, cost, community support, etc. While there is no single "best" database, almost any of the popular solutions should be more than acceptable for a small-to-medium-sized site like our Local Library.
For more information on the options see Database integration (Express docs).
What is the best way to interact with a database?
There are two common approaches for interacting with a database:
Using the databases' native query language, such as SQL.
Using an Object Relational Mapper ("ORM") or Object Document Mapper ("ODM"). These represent the website's data as JavaScript objects, which are then mapped to the underlying database. Some ORMs and ODMs are tied to a specific database, while others provide a database-agnostic backend.
The very best performance can be gained by using SQL, or whatever query language is supported by the database. Object mappers are often slower because they use translation code to map between objects and the database format, which may not use the most efficient database queries (this is particularly true if the mapper supports different database backends, and must make greater compromises in terms of what database features are supported).
The benefit of using an ORM/ODM is that programmers can continue to think in terms of JavaScript objects rather than database semantics — this is particularly true if you need to work with different databases (on either the same or different websites). They also provide an obvious place to perform data validation.
Note: Using ODM/ORMs often results in lower costs for development and maintenance! Unless you're very familiar with the native query language or performance is paramount, you should strongly consider using an ODM.
What ORM/ODM should I use?
There are many ODM/ORM solutions available on the npm package manager site (check out the odm and orm tags for a subset!).
A few solutions that were popular at the time of writing are:
Mongoose: Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
Waterline: An ORM extracted from the Express-based Sails web framework. It provides a uniform API for accessing numerous different databases, including Redis, MySQL, LDAP, MongoDB, and Postgres.
Bookshelf: Features both promise-based and traditional callback interfaces, providing transaction support, eager/nested-eager relation loading, polymorphic associations, and support for one-to-one, one-to-many, and many-to-many relations. Works with PostgreSQL, MySQL, and SQLite3.
Objection: Makes it as easy as possible to use the full power of SQL and the underlying database engine (supports SQLite3, Postgres, and MySQL).
Sequelize is a promise-based ORM for Node.js and io.js. It supports the dialects PostgreSQL, MySQL, MariaDB, SQLite, and MSSQL and features solid transaction support, relations, read replication and more.
Node ORM2 is an Object Relationship Manager for NodeJS. It supports MySQL, SQLite, and Postgres, helping to work with the database using an object-oriented approach.
GraphQL: Primarily a query language for restful APIs, GraphQL is very popular, and has features available for reading data from databases.
As a general rule, you should consider both the features provided and the "community activity" (downloads, contributions, bug reports, quality of documentation, etc.) when selecting a solution. At the time of writing Mongoose is by far the most popular ODM, and is a reasonable choice if you're using MongoDB for your database.
Using Mongoose and MongoDB for the LocalLibrary
For the Local Library example (and the rest of this topic) we're going to use the Mongoose ODM to access our library data. Mongoose acts as a front end to MongoDB, an open source NoSQL database that uses a document-oriented data model. A "collection" of "documents" in a MongoDB database is analogous to a "table" of "rows" in a relational database.
This ODM and database combination is extremely popular in the Node community, partially because the document storage and query system looks very much like JSON, and is hence familiar to JavaScript developers.
Note: You don't need to know MongoDB in order to use Mongoose, although parts of the Mongoose documentation are easier to use and understand if you are already familiar with MongoDB.
The rest of this tutorial shows how to define and access the Mongoose schema and models for the LocalLibrary website example.
Designing the LocalLibrary models
Before you jump in and start coding the models, it's worth taking a few minutes to think about what data we need to store and the relationships between the different objects.
We know that we need to store information about books (title, summary, author, genre, ISBN) and that we might have multiple copies available (with globally unique ids, availability statuses, etc.). We might need to store more information about the author than just their name, and there might be multiple authors with the same or similar names. We want to be able to sort information based on the book title, author, genre, and category.
When designing your models it makes sense to have separate models for every "object" (a group of related information). In this case some obvious candidates for these models are books, book instances, and authors.
You might also want to use models to represent selection-list options (e.g., like a drop-down list of choices), rather than hard-coding the choices into the website itself — this is recommended when all the options aren't known up front or may change. A good example is a genre (e.g., fantasy, science fiction, etc.).
Once we've decided on our models and fields, we need to think about the relationships between them.
With that in mind, the UML association diagram below shows the models we'll define in this case (as boxes). As discussed above, we've created models for the book (the generic details of the book), book instance (status of specific physical copies of the book available in the system), and author. We have also decided to have a model for the genre so that values can be created dynamically. We've decided not to have a model for the BookInstance:status — we will hard code the acceptable values because we don't expect these to change. Within each of the boxes, you can see the model name, the field names and types, and also the methods and their return types.
The diagram also shows the relationships between the models, including their multiplicities. The multiplicities are the numbers on the diagram showing the numbers (maximum and minimum) of each model that may be present in the relationship. For example, the connecting line between the boxes shows that Book and a Genre are related. The numbers close to the Book model show that a Genre must have zero or more Books (as many as you like), while the numbers on the other end of the line next to the Genre show that a book can have zero or more associated Genres.
Note: As discussed in our Mongoose primer below it is often better to have the field that defines the relationship between the documents/models in just one model (you can still find the reverse relationship by searching for the associated _id in the other model). Below we have chosen to define the relationship between Book/Genre and Book/Author in the Book schema, and the relationship between the Book/BookInstance in the BookInstance Schema. This choice was somewhat arbitrary — we could equally well have had the field in the other schema.

Note: The next section provides a basic primer explaining how models are defined and used. As you read it, consider how we will construct each of the models in the diagram above.
Database APIs are asynchronous
Database methods to create, find, update, or delete records are asynchronous. What this means is that the methods return immediately, and the code to handle the success or failure of the method runs at a later time when the operation completes. Other code can execute while the server is waiting for the database operation to complete, so the server can remain responsive to other requests.
JavaScript has a number of mechanisms for supporting asynchronous behavior. Historically JavaScript relied heavily on passing callback functions to asynchronous methods to handle the success and error cases. In modern JavaScript callbacks have largely been replaced by Promises. Promises are objects that are (immediately) returned by an asynchronous method that represent its future state. When the operation completes, the promise object is "settled", and resolves an object that represents the result of the operation or an error.
There are two main ways you can use promises to run code when a promise is settled, and we highly recommend that you read How to use promises for a high level overview of both approaches. In this tutorial, we'll primarily be using await to wait on promise completion within an async function, because this leads to more readable and understandable asynchronous code.
The way this approach works is that you use the async function keyword to mark a function as asynchronous, and then inside that function apply await to any method that returns a promise. When the asynchronous function is executed its operation is paused at the first await method until the promise settles. From the perspective of the surrounding code the asynchronous function then returns and the code after it is able to run. Later when the promise settles, the await method inside the asynchronous function returns with the result, or an error is thrown if the promise was rejected. The code in the asynchronous function then executes until either another await is encountered, at which point it will pause again, or until all the code in the function has been run.
You can see how this works in the example below. myFunction() is an asynchronous function that is called within a try...catch block. When myFunction() is run, code execution is paused at methodThatReturnsPromise() until the promise resolves, at which point the code continues to aFunctionThatReturnsPromise() and waits again. The code in the catch block runs if an error is thrown in the asynchronous function, and this will happen if the promise returned by either of the methods is rejected.
js
Copy to Clipboard
async function myFunction() {
  // …
  await someObject.methodThatReturnsPromise();
  // …
  await aFunctionThatReturnsPromise();
  // …
}

try {
  // …
  myFunction();
  // …
} catch (e) {
  // error handling code
}

The asynchronous methods above are run in sequence. If the methods don't depend on each other then you can run them in parallel and finish the whole operation more quickly. This is done using the Promise.all() method, which takes an iterable of promises as input and returns a single Promise. This returned promise fulfills when all of the input's promises fulfill, with an array of the fulfillment values. It rejects when any of the input's promises rejects, with this first rejection reason.
The code below shows how this works. First, we have two functions that return promises. We await on both of them to complete using the promise returned by Promise.all(). Once they both complete await returns and the results array is populated, the function then continues to the next await, and waits until the promise returned by anotherFunctionThatReturnsPromise() is settled. You would call the myFunction() in a try...catch block to catch any errors.
js
Copy to Clipboard
async function myFunction() {
  // …
  const [resultFunction1, resultFunction2] = await Promise.all([
    functionThatReturnsPromise1(),
    functionThatReturnsPromise2(),
  ]);
  // …
  await anotherFunctionThatReturnsPromise(resultFunction1);
}

Promises with await/async allow both flexible and "comprehensible" control over asynchronous execution!
Mongoose primer
This section provides an overview of how to connect Mongoose to a MongoDB database, how to define a schema and a model, and how to make basic queries.
Note: This primer is heavily influenced by the Mongoose quick start on npm and the official documentation.
Installing Mongoose and MongoDB
Mongoose is installed in your project (package.json) like any other dependency — using npm. To install it, use the following command inside your project folder:
bash
Copy to Clipboard
npm install mongoose

Installing Mongoose adds all its dependencies, including the MongoDB database driver, but it does not install MongoDB itself. If you want to install a MongoDB server then you can download installers from here for various operating systems and install it locally. You can also use cloud-based MongoDB instances.
Note: For this tutorial, we'll be using the MongoDB Atlas cloud-based database as a service free tier to provide the database. This is suitable for development and makes sense for the tutorial because it makes "installation" operating system independent (database-as-a-service is also one approach you might use for your production database).
Connecting to MongoDB
Mongoose requires a connection to a MongoDB database. You can require() and connect to a locally hosted database with mongoose.connect() as shown below (for the tutorial we'll instead connect to an internet-hosted database).
js
Copy to Clipboard
// Import the mongoose module
const mongoose = require("mongoose");

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

// Define the database URL to connect to.
const mongoDB = "mongodb://127.0.0.1/my_database";

// Wait for database to connect, logging an error if there is a problem
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

Note: As discussed in the Database APIs are asynchronous section, here we await on the promise returned by the connect() method within an async function. We use the promise catch() handler to handle any errors when trying to connect, but we might also have called main() within a try...catch block.
You can get the default Connection object with mongoose.connection. If you need to create additional connections you can use mongoose.createConnection(). This takes the same form of database URI (with host, database, port, options, etc.) as connect() and returns a Connection object). Note that createConnection() returns immediately; if you need to wait on the connection to be established you can call it with asPromise() to return a promise (mongoose.createConnection(mongoDB).asPromise()).
Defining and creating models
Models are defined using the Schema interface. The Schema allows you to define the fields stored in each document along with their validation requirements and default values. In addition, you can define static and instance helper methods to make it easier to work with your data types, and also virtual properties that you can use like any other field, but which aren't actually stored in the database (we'll discuss a bit further below).
Schemas are then "compiled" into models using the mongoose.model() method. Once you have a model you can use it to find, create, update, and delete objects of the given type.
Note: Each model maps to a collection of documents in the MongoDB database. The documents will contain the fields/schema types defined in the model Schema.
Defining schemas
The code fragment below shows how you might define a simple schema. First you require() mongoose, then use the Schema constructor to create a new schema instance, defining the various fields inside it in the constructor's object parameter.
js
Copy to Clipboard
// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const SomeModelSchema = new Schema({
  a_string: String,
  a_date: Date,
});

In the case above we just have two fields, a string and a date. In the next sections, we will show some of the other field types, validation, and other methods.
Creating a model
Models are created from schemas using the mongoose.model() method:
js
Copy to Clipboard
// Define schema
const Schema = mongoose.Schema;

const SomeModelSchema = new Schema({
  a_string: String,
  a_date: Date,
});

// Compile model from schema
const SomeModel = mongoose.model("SomeModel", SomeModelSchema);

The first argument is the singular name of the collection that will be created for your model (Mongoose will create the database collection for the model SomeModel above), and the second argument is the schema you want to use in creating the model.
Note: Once you've defined your model classes you can use them to create, update, or delete records, and run queries to get all records or particular subsets of records. We'll show you how to do this in the Using models section, and when we create our views.
Schema types (fields)
A schema can have an arbitrary number of fields — each one represents a field in the documents stored in MongoDB. An example schema showing many of the common field types and how they are declared is shown below.
js
Copy to Clipboard
const schema = new Schema({
  name: String,
  binary: Buffer,
  living: Boolean,
  updated: { type: Date, default: Date.now() },
  age: { type: Number, min: 18, max: 65, required: true },
  mixed: Schema.Types.Mixed,
  _someId: Schema.Types.ObjectId,
  array: [],
  ofString: [String], // You can also have an array of each of the other types too.
  nested: { stuff: { type: String, lowercase: true, trim: true } },
});

Most of the SchemaTypes (the descriptors after "type:" or after field names) are self-explanatory. The exceptions are:
ObjectId: Represents specific instances of a model in the database. For example, a book might use this to represent its author object. This will actually contain the unique ID (_id) for the specified object. We can use the populate() method to pull in the associated information when needed.
Mixed: An arbitrary schema type.
[]: An array of items. You can perform JavaScript array operations on these models (push, pop, unshift, etc.). The examples above show an array of objects without a specified type and an array of String objects, but you can have an array of any type of object.
The code also shows both ways of declaring a field:
Field name and type as a key-value pair (i.e., as done with fields name, binary and living).
Field name followed by an object defining the type, and any other options for the field. Options include things like:
default values.
built-in validators (e.g., max/min values) and custom validation functions.
Whether the field is required
Whether String fields should automatically be set to lowercase, uppercase, or trimmed (e.g., { type: String, lowercase: true, trim: true })
For more information about options see SchemaTypes (Mongoose docs).
Validation
Mongoose provides built-in and custom validators, and synchronous and asynchronous validators. It allows you to specify both the acceptable range of values and the error message for validation failure in all cases.
The built-in validators include:
All SchemaTypes have the built-in required validator. This is used to specify whether the field must be supplied in order to save a document.
Numbers have min and max validators.
Strings have:
enum: specifies the set of allowed values for the field.
match: specifies a regular expression that the string must match.
maxLength and minLength for the string.
The example below (slightly modified from the Mongoose documents) shows how you can specify some of the validator types and error messages:
js
Copy to Clipboard
const breakfastSchema = new Schema({
  eggs: {
    type: Number,
    min: [6, "Too few eggs"],
    max: 12,
    required: [true, "Why no eggs?"],
  },
  drink: {
    type: String,
    enum: ["Coffee", "Tea", "Water"],
  },
});

For complete information on field validation see Validation (Mongoose docs).
Virtual properties
Virtual properties are document properties that you can get and set but that do not get persisted to MongoDB. The getters are useful for formatting or combining fields, while setters are useful for de-composing a single value into multiple values for storage. The example in the documentation constructs (and deconstructs) a full name virtual property from a first and last name field, which is easier and cleaner than constructing a full name every time one is used in a template.
Note: We will use a virtual property in the library to define a unique URL for each model record using a path and the record's _id value.
For more information see Virtuals (Mongoose documentation).
Methods and query helpers
A schema can also have instance methods, static methods, and query helpers. The instance and static methods are similar, but with the obvious difference that an instance method is associated with a particular record and has access to the current object. Query helpers allow you to extend mongoose's chainable query builder API (for example, allowing you to add a query "byName" in addition to the find(), findOne() and findById() methods).
Using models
Once you've created a schema you can use it to create models. The model represents a collection of documents in the database that you can search, while the model's instances represent individual documents that you can save and retrieve.
We provide a brief overview below. For more information see: Models (Mongoose docs).
Note: Creation, update, deletion and querying of records are asynchronous operations that return a promise. The examples below show just the use of the relevant methods and await (i.e., the essential code for using the methods). The surrounding async function and try...catch block to catch errors are omitted for clarity. For more information on using await/async see Database APIs are asynchronous above.
Creating and modifying documents
To create a record you can define an instance of the model and then call save() on it. The examples below assume SomeModel is a model (with a single field name) that we have created from our schema.
js
Copy to Clipboard
// Create an instance of model SomeModel
const awesome_instance = new SomeModel({ name: "awesome" });

// Save the new model instance asynchronously
await awesome_instance.save();

You can also use create() to define the model instance at the same time as you save it. Below we create just one, but you can create multiple instances by passing in an array of objects.
js
Copy to Clipboard
await SomeModel.create({ name: "also_awesome" });

Every model has an associated connection (this will be the default connection when you use mongoose.model()). You create a new connection and call .model() on it to create the documents on a different database.
You can access the fields in this new record using the dot syntax, and change the values. You have to call save() or update() to store modified values back to the database.
js
Copy to Clipboard
// Access model field values using dot notation
console.log(awesome_instance.name); // should log 'also_awesome'

// Change record by modifying the fields, then calling save().
awesome_instance.name = "New cool name";
await awesome_instance.save();

Searching for records
You can search for records using query methods, specifying the query conditions as a JSON document. The code fragment below shows how you might find all athletes in a database that play tennis, returning just the fields for athlete name and age. Here we just specify one matching field (sport) but you can add more criteria, specify regular expression criteria, or remove the conditions altogether to return all athletes.
js
Copy to Clipboard
const Athlete = mongoose.model("Athlete", yourSchema);

// find all athletes who play tennis, returning the 'name' and 'age' fields
const tennisPlayers = await Athlete.find(
  { sport: "Tennis" },
  "name age",
).exec();

Note: It is important to remember that not finding any results is not an error for a search — but it may be a fail-case in the context of your application. If your application expects a search to find a value you can check the number of entries returned in the result.
Query APIs, such as find(), return a variable of type Query. You can use a query object to build up a query in parts before executing it with the exec() method. exec() executes the query and returns a promise that you can await on for the result.
js
Copy to Clipboard
// find all athletes that play tennis
const query = Athlete.find({ sport: "Tennis" });

// selecting the 'name' and 'age' fields
query.select("name age");

// limit our results to 5 items
query.limit(5);

// sort by age
query.sort({ age: -1 });

// execute the query at a later time
query.exec();

Above we've defined the query conditions in the find() method. We can also do this using a where() function, and we can chain all the parts of our query together using the dot operator (.) rather than adding them separately. The code fragment below is the same as our query above, with an additional condition for the age.
js
Copy to Clipboard
Athlete.find()
  .where("sport")
  .equals("Tennis")
  .where("age")
  .gt(17)
  .lt(50) // Additional where query
  .limit(5)
  .sort({ age: -1 })
  .select("name age")
  .exec();

The find() method gets all matching records, but often you just want to get one match. The following methods query for a single record:
findById(): Finds the document with the specified id (every document has a unique id).
findOne(): Finds a single document that matches the specified criteria.
findByIdAndDelete(), findByIdAndUpdate(), findOneAndRemove(), findOneAndUpdate(): Finds a single document by id or criteria and either updates or removes it. These are useful convenience functions for updating and removing records.
Note: There is also a countDocuments() method that you can use to get the number of items that match conditions. This is useful if you want to perform a count without actually fetching the records.
There is a lot more you can do with queries. For more information see: Queries (Mongoose docs).
Working with related documents — population
You can create references from one document/model instance to another using the ObjectId schema field, or from one document to many using an array of ObjectIds. The field stores the id of the related model. If you need the actual content of the associated document, you can use the populate() method in a query to replace the id with the actual data.
For example, the following schema defines authors and stories. Each author can have multiple stories, which we represent as an array of ObjectId. Each story can have a single author. The ref property tells the schema which model can be assigned to this field.
js
Copy to Clipboard
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: String,
  stories: [{ type: Schema.Types.ObjectId, ref: "Story" }],
});

const storySchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "Author" },
  title: String,
});

const Story = mongoose.model("Story", storySchema);
const Author = mongoose.model("Author", authorSchema);

We can save our references to the related document by assigning the _id value. Below we create an author, then a story, and assign the author id to our story's author field.
js
Copy to Clipboard
const bob = new Author({ name: "Bob Smith" });

await bob.save();

// Bob now exists, so lets create a story
const story = new Story({
  title: "Bob goes sledding",
  author: bob._id, // assign the _id from our author Bob. This ID is created by default!
});

await story.save();

Note: One great benefit of this style of programming is that we don't have to complicate the main path of our code with error checking. If any of the save() operations fail, the promise will reject and an error will be thrown. Our error handling code deals with that separately (usually in a catch() block), so the intent of our code is very clear.
Our story document now has an author referenced by the author document's ID. In order to get the author information in the story results we use populate(), as shown below.
js
Copy to Clipboard
Story.findOne({ title: "Bob goes sledding" })
  .populate("author") // Replace the author id with actual author information in results
  .exec();

Note: Astute readers will have noted that we added an author to our story, but we didn't do anything to add our story to our author's stories array. How then can we get all stories by a particular author? One way would be to add our story to the stories array, but this would result in us having two places where the information relating authors and stories needs to be maintained.
A better way is to get the _id of our author, then use find() to search for this in the author field across all stories.
js
Copy to Clipboard
Story.find({ author: bob._id }).exec();

This is almost everything you need to know about working with related items for this tutorial. For more detailed information see Population (Mongoose docs).
One schema/model per file
While you can create schemas and models using any file structure you like, we highly recommend defining each model schema in its own module (file), then exporting the method to create the model. This is shown below:
js
Copy to Clipboard
// File: ./models/some-model.js

// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const SomeModelSchema = new Schema({
  a_string: String,
  a_date: Date,
});

// Export function to create "SomeModel" model class
module.exports = mongoose.model("SomeModel", SomeModelSchema);

You can then require and use the model immediately in other files. Below we show how you might use it to get all instances of the model.
js
Copy to Clipboard
// Create a SomeModel model just by requiring the module
const SomeModel = require("../models/some-model");

// Use the SomeModel object (model) to find all SomeModel records
const modelInstances = await SomeModel.find().exec();

Setting up the MongoDB database
Now that we understand something of what Mongoose can do and how we want to design our models, it's time to start work on the LocalLibrary website. The very first thing we want to do is set up a MongoDB database that we can use to store our library data.
For this tutorial, we're going to use the MongoDB Atlas cloud-hosted sandbox database. This database tier is not considered suitable for production websites because it has no redundancy, but it is great for development and prototyping. We're using it here because it is free and easy to set up, and because MongoDB Atlas is a popular database as a service vendor that you might reasonably choose for your production database (other popular choices at the time of writing include ScaleGrid and ObjectRocket).
Note: If you prefer, you can set up a MongoDB database locally by downloading and installing the appropriate binaries for your system. The rest of the instructions in this article would be similar, except for the database URL you would specify when connecting. In the Express Tutorial Part 7: Deploying to Production tutorial we host both the application and database on Railway, but we could equally well have used a database on MongoDB Atlas.
You will first need to create an account with MongoDB Atlas (this is free, and just requires that you enter basic contact details and acknowledge their terms of service).
After logging in, you'll be taken to the home screen:
Click the + Create button in the Overview section.

This will open the Deploy your cluster screen. Click on the M0 FREE option template.

Scroll down the page to see the different options you can choose.
You can change the name of your Cluster under Cluster Name. We are keeping it as Cluster0 for this tutorial.
Deselect the Preload sample dataset checkbox, as we'll import our own sample data later on
Select any provider and region from the Provider and Region sections. Different regions offer different providers.
Tags are optional. We will not use them here.
Click the Create deployment button (creation of the cluster will take some minutes).
This will open the Security Quickstart section.
Enter a username and password for your application to use to access the database (above we have created a new login "cooluser"). Remember to copy and store the credentials safely as we will need them later on. Click the Create User button.
Note: Avoid using special characters in your MongoDB user password as mongoose may not parse the connection string properly.
Select Add by current IP address to allow access from your current computer
Enter 0.0.0.0/0 in the IP Address field and then click the Add Entry button. This tells MongoDB that we want to allow access from anywhere.
Note: It is a best practice to limit the IP addresses that can connect to your database and other resources. Here we allow a connection from anywhere because we don't know where the request will come from after deployment.
Click the Finish and Close button.
This will open the following screen. Click on the Go to Overview button.
You will return to the Overview screen. Click on the Database section under the Deployment menu on the left. Click the Browse Collections button.
This will open the Collections section. Click the Add My Own Data button.
This will open the Create Database screen.

Enter the name for the new database as local_library.
Enter the name of the collection as Collection0.
Click the Create button to create the database.
You will return to the Collections screen with your database created.
Click the Overview tab to return to the cluster overview.
From the Cluster0 Overview screen click the Connect button.

This will open the Connect to Cluster0 screen.

Select your database user.
Select the Drivers category, then the Driver Node.js and Version as shown.
DO NOT install the driver as suggested.
Click the Copy icon to copy the connection string.
Paste this in your local text editor.
Replace <password> placeholder in the connection string with your user's password.
Insert the database name "local_library" in the path before the options (...mongodb.net/local_library?retryWrites...)
Save the file containing this string somewhere safe.
You have now created the database, and have a URL (with username and password) that can be used to access it. This will look something like: mongodb+srv://your_user_name:your_password@cluster0.cojoign.mongodb.net/local_library?retryWrites=true&w=majority&appName=Cluster0
Install Mongoose
Open a command prompt and navigate to the directory where you created your skeleton Local Library website. Enter the following command to install Mongoose (and its dependencies) and add it to your package.json file, unless you have already done so when reading the Mongoose Primer above.
bash
Copy to Clipboard
npm install mongoose

Connect to MongoDB
Open bin/www (from the root of your project) and copy the following text below where you set the port (after the line app.set("port", port);). Replace the database URL string ('insert_your_database_url_here') with the location URL representing your own database (i.e., using the information from MongoDB Atlas).
js
Copy to Clipboard
// Set up mongoose connection
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const mongoDB = "insert_your_database_url_here";

async function connectMongoose() {
  await mongoose.connect(mongoDB);
}

try {
  connectMongoose();
} catch (err) {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
}

As discussed in the Mongoose primer above, this code creates the default connection to the database and reports any errors to the console.
Note: We could have put the database connection code in our app.js code. Putting it in the application entry point decouples the application and database, which makes it easier to use a different database for running test code.
Note that hard-coding database credentials in source code as shown above is not recommended. We do it here because it shows the core connection code, and because during development there is no significant risk that leaking these details will expose or corrupt sensitive information. We'll show you how to do this more safely when deploying to production!
Defining the LocalLibrary Schema
We will define a separate module for each model, as discussed above. Start by creating a folder for our models in the project root (/models) and then create separate files for each of the models:
/express-locallibrary-tutorial  # the project root
  /models
    author.js
    book.js
    bookinstance.js
    genre.js

Author model
Copy the Author schema code shown below and paste it into your ./models/author.js file. The schema defines an author as having String SchemaTypes for the first and family names (required, with a maximum of 100 characters), and Date fields for the dates of birth and death.
js
Copy to Clipboard
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

// Export model
module.exports = mongoose.model("Author", AuthorSchema);

We've also declared a virtual for the AuthorSchema named "url" that returns the absolute URL required to get a particular instance of the model — we'll use the property in our templates whenever we need to get a link to a particular author.
Note: Declaring our URLs as a virtual in the schema is a good idea because then the URL for an item only ever needs to be changed in one place. At this point, a link using this URL wouldn't work, because we haven't got any routes handling code for individual model instances. We'll set those up in a later article!
At the end of the module, we export the model.
Book model
Copy the Book schema code shown below and paste it into your ./models/book.js file. Most of this is similar to the author model — we've declared a schema with a number of string fields and a virtual for getting the URL of specific book records, and we've exported the model.
js
Copy to Clipboard
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});

// Virtual for book's URL
BookSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/book/${this._id}`;
});

// Export model
module.exports = mongoose.model("Book", BookSchema);

The main difference here is that we've created two references to other models:
author is a reference to a single Author model object, and is required.
genre is a reference to an array of Genre model objects. We haven't declared this object yet!
BookInstance model
Finally, copy the BookInstance schema code shown below and paste it into your ./models/bookinstance.js file. The BookInstance represents a specific copy of a book that someone might borrow and includes information about whether the copy is available, on what date it is expected back, and "imprint" (or version) details.
js
Copy to Clipboard
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true }, // reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back: { type: Date, default: Date.now },
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/bookinstance/${this._id}`;
});

// Export model
module.exports = mongoose.model("BookInstance", BookInstanceSchema);

The new things we show here are the field options:
enum: This allows us to set the allowed values of a string. In this case, we use it to specify the availability status of our books (using an enum means that we can prevent mis-spellings and arbitrary values for our status).
default: We use default to set the default status for newly created book instances to "Maintenance" and the default due_back date to now (note how you can call the Date function when setting the date!).
Everything else should be familiar from our previous schema.
Genre model - challenge
Open your ./models/genre.js file and create a schema for storing genres (the category of book, e.g., whether it is fiction or non-fiction, romance or military history, etc.).
The definition will be very similar to the other models:
The model should have a String SchemaType called name to describe the genre.
This name should be required and have between 3 and 100 characters.
Declare a virtual for the genre's URL, named url.
Export the model.
Testing — create some items
That's it. We now have all models for the site set up!
In order to test the models (and to create some example books and other items that we can use in our next articles) we'll now run an independent script to create items of each type:
Download (or otherwise create) the file populatedb.js inside your express-locallibrary-tutorial directory (in the same level as package.json).
Note: The code in populatedb.js may be useful in learning JavaScript, but understanding it is not necessary for this tutorial.
Run the script using node in your command prompt, passing in the URL of your MongoDB database (the same one you replaced the insert_your_database_url_here placeholder with, inside app.js earlier):
bash
Copy to Clipboard
node populatedb <your MongoDB url>
Note: On Windows you need to wrap the database URL inside double ("). On other operating systems you may need single (') quotation marks.
The script should run through to completion, displaying items as it creates them in the terminal.
Note: Go to your database on MongoDB Atlas (in the Collections tab). You should now be able to drill down into individual collections of Books, Authors, Genres and BookInstances, and check out individual documents.
Summary
In this article, we've learned a bit about databases and ORMs on Node/Express, and a lot about how Mongoose schema and models are defined. We then used this information to design and implement Book, BookInstance, Author and Genre models for the LocalLibrary website.
Last of all, we tested our models by creating a number of instances (using a standalone script). In the next article we'll look at creating some pages to display these objects.
See also
Database integration (Express docs)
Mongoose website (Mongoose docs)
Mongoose Guide (Mongoose docs)
Validation (Mongoose docs)
Schema Types (Mongoose docs)
Models (Mongoose docs)
Queries (Mongoose docs)
Population (Mongoose docs)
Previous


Overview: Express web framework (Node.js/JavaScript)


Express Tutorial Part 4: Routes and controllers
Previous


Overview: Express web framework (Node.js/JavaScript)


Next


In this tutorial we'll set up routes (URL handling code) with "dummy" handler functions for all the resource endpoints that we'll eventually need in the LocalLibrary website. On completion we'll have a modular structure for our route handling code, which we can extend with real handler functions in the following articles. We'll also have a really good understanding of how to create modular routes using Express!
Prerequisites:
Read the Express/Node introduction. Complete previous tutorial topics (including Express Tutorial Part 3: Using a Database (with Mongoose)).
Objective:
To understand how to create simple routes. To set up all our URL endpoints.

Overview
In the last tutorial article we defined Mongoose models to interact with the database, and used a (standalone) script to create some initial library records. We can now write the code to present that information to users. The first thing we need to do is determine what information we want to be able to display in our pages, and then define appropriate URLs for returning those resources. Then we're going to need to create the routes (URL handlers) and views (templates) to display those pages.
The diagram below is provided as a reminder of the main flow of data and things that need to be implemented when handling an HTTP request/response. In addition to the views and routes the diagram shows "controllers" — functions that separate out the code to route requests from the code that actually processes requests.
As we've already created the models, the main things we'll need to create are:
"Routes" to forward the supported requests (and any information encoded in request URLs) to the appropriate controller functions.
Controller functions to get the requested data from the models, create an HTML page displaying the data, and return it to the user to view in the browser.
Views (templates) used by the controllers to render the data.

Ultimately we might have pages to show lists and detail information for books, genres, authors and bookinstances, along with pages to create, update, and delete records. That's a lot to document in one article. Therefore most of this article will concentrate on setting up our routes and controllers to return "dummy" content. We'll extend the controller methods in our subsequent articles to work with model data.
The first section below provides a brief "primer" on how to use the Express Router middleware. We'll then use that knowledge in the following sections when we set up the LocalLibrary routes.
Routes primer
A route is a section of Express code that associates an HTTP verb (GET, POST, PUT, DELETE, etc.), a URL path/pattern, and a function that is called to handle that pattern.
There are several ways to create routes. For this tutorial we're going to use the express.Router middleware as it allows us to group the route handlers for a particular part of a site together and access them using a common route-prefix. We'll keep all our library-related routes in a "catalog" module, and, if we add routes for handling user accounts or other functions, we can keep them grouped separately.
Note: We discussed Express application routes briefly in our Express Introduction > Creating route handlers. Other than providing better support for modularization (as discussed in the first subsection below), using Router is very similar to defining routes directly on the Express application object.
The rest of this section provides an overview of how the Router can be used to define the routes.
Defining and using separate route modules
The code below provides a concrete example of how we can create a route module and then use it in an Express application.
First we create routes for a wiki in a module named wiki.js. The code first imports the Express application object, uses it to get a Router object and then adds a couple of routes to it using the get() method. Last of all the module exports the Router object.
js
Copy to Clipboard
// wiki.js - Wiki route module.

const express = require("express");

const router = express.Router();

// Home page route.
router.get("/", (req, res) => {
  res.send("Wiki home page");
});

// About page route.
router.get("/about", (req, res) => {
  res.send("About this wiki");
});

module.exports = router;

Note: Above we are defining our route handler callbacks directly in the router functions. In the LocalLibrary we'll define these callbacks in a separate controller module.
To use the router module in our main app file we first require() the route module (wiki.js). We then call use() on the Express application to add the Router to the middleware handling path, specifying a URL path of 'wiki'.
js
Copy to Clipboard
const wiki = require("./wiki.js");

// …
app.use("/wiki", wiki);

The two routes defined in our wiki route module are then accessible from /wiki/ and /wiki/about/.
Route functions
Our module above defines a couple of typical route functions. The "about" route (reproduced below) is defined using the Router.get() method, which responds only to HTTP GET requests. The first argument to this method is the URL path while the second is a callback function that will be invoked if an HTTP GET request with the path is received.
js
Copy to Clipboard
router.get("/about", (req, res) => {
  res.send("About this wiki");
});

The callback takes three arguments (usually named as shown: req, res, next), that will contain the HTTP Request object, HTTP response, and the next function in the middleware chain.
Note: Router functions are Express middleware, which means that they must either complete (respond to) the request or call the next function in the chain. In the case above we complete the request using send(), so the next argument is not used (and we choose not to specify it).
The router function above takes a single callback, but you can specify as many callback arguments as you want, or an array of callback functions. Each function is part of the middleware chain, and will be called in the order it is added to the chain (unless a preceding function completes the request).
The callback function here calls send() on the response to return the string "About this wiki" when we receive a GET request with the path (/about). There are a number of other response methods for ending the request/response cycle. For example, you could call res.json() to send a JSON response or res.sendFile() to send a file. The response method that we'll be using most often as we build up the library is render(), which creates and returns HTML files using templates and data—we'll talk a lot more about that in a later article!
HTTP verbs
The example routes above use the Router.get() method to respond to HTTP GET requests with a certain path.
The Router also provides route methods for all the other HTTP verbs, that are mostly used in exactly the same way: post(), put(), delete(), options(), trace(), copy(), lock(), mkcol(), move(), purge(), propfind(), proppatch(), unlock(), report(), mkactivity(), checkout(), merge(), m-search(), notify(), subscribe(), unsubscribe(), patch(), search(), and connect().
For example, the code below behaves just like the previous /about route, but only responds to HTTP POST requests.
js
Copy to Clipboard
router.post("/about", (req, res) => {
  res.send("About this wiki");
});

Route paths
The route paths define the endpoints at which requests can be made. The examples we've seen so far have just been strings, and are used exactly as written: '/', '/about', '/book', '/any-random.path'.
Route paths can also be string patterns. String patterns use a form of regular expression syntax to define patterns of endpoints that will be matched. Most of our routes for the LocalLibrary will use strings and not regular expressions We'll also use route parameters as discussed in the next section.
Route parameters
Route parameters are named URL segments used to capture values at specific positions in the URL. The named segments are prefixed with a colon and then the name (E.g., /:your_parameter_name/). The captured values are stored in the req.params object using the parameter names as keys (E.g., req.params.your_parameter_name).
So for example, consider a URL encoded to contain information about users and books: http://localhost:3000/users/34/books/8989. We can extract this information as shown below, with the userId and bookId path parameters:
js
Copy to Clipboard
app.get("/users/:userId/books/:bookId", (req, res) => {
  // Access userId via: req.params.userId
  // Access bookId via: req.params.bookId
  res.send(req.params);
});

Note: The URL /book/create will be matched by a route like /book/:bookId (because :bookId is a placeholder for any string, therefore create matches). The first route that matches an incoming URL will be used, so if you want to process /book/create URLs specifically, their route handler must be defined before your /book/:bookId route.
Route parameter names (for example, bookId, above) can be any valid JavaScript identifier that starts with a letter, _, or $. You can include digits after the first character, but not hyphens and spaces. You can also use names that aren't valid JavaScript identifiers, including spaces, hyphens, emoticons, or any other character, but you need to define them with a quoted string and access them using bracket notation. For example:
js
Copy to Clipboard
app.get('/users/:"user id"/books/:"book-id"', (req, res) => {
  // Access quoted param using bracket notation
  const user = req.params["user id"];
  const book = req.params["book-id"];
  res.send({ user, book });
});

Wildcards
Wildcard parameters match one or more characters across multiple segments, returning each segment as a value in an array. They are defined the same way as regular parameters, but are prefixed with an asterisk.
So for example, consider the URL http://localhost:3000/users/34/books/8989, we can extract all the information after users/ with the example wildcard:
js
Copy to Clipboard
app.get("/users/*example", (req, res) => {
  // req.params would contain { "example": ["34", "books", "8989"]}
  res.send(req.params);
});

Optional parts
Braces can be used to define parts of the path that are optional. For example, below we match a filename with any extension (or none).
js
Copy to Clipboard
app.get("/file/:filename{.:ext}", (req, res) => {
  // Given URL: http://localhost:3000/file/somefile.md`
  // req.params would contain { "filename": "somefile", "ext": "md"}
  res.send(req.params);
});

Reserved characters
The following characters are reserved: (()[]?+!). If you want to use them, you must escape them with a backslash (\).
You also can't use the pipe character (|) in a regular expression.
That's all you need to get started with routes. If needed, you can find more information in the Express docs: Basic routing and Routing guide. The following sections show how we'll set up our routes and controllers for the LocalLibrary.
Handling errors and exceptions in the route functions
The route functions shown earlier all have arguments req and res, which represent the request and response, respectively. Route functions are also passed a third argument, next, which contains a callback function that can be called to pass any errors or exceptions to the Express middleware chain, where they will eventually propagate to your global error handling code.
From Express 5, next is called automatically with the rejection value if a route handler returns a Promise that subsequently rejects; therefore, no error handling code is required in route functions when using promises. This leads to very compact code when working with asynchronous promise-based APIs, in particular when using async and await.
For example, the following code uses the find() method to query a database and then renders the result.
js
Copy to Clipboard
exports.get("/about", async (req, res, next) => {
  const successfulResult = await About.find({}).exec();
  res.render("about_view", { title: "About", list: successfulResult });
});

The code below shows the same example using a promise chain. Note that if you wanted to, you could catch() the error and implement your own custom handling.
js
Copy to Clipboard
exports.get(
  "/about",
  // Removed 'async'
  (req, res, next) =>
    About.find({})
      .exec()
      .then((successfulResult) => {
        res.render("about_view", { title: "About", list: successfulResult });
      })
      .catch((err) => {
        next(err);
      }),
);

Note: Most modern APIs are asynchronous and promise-based, so error handling is often that straightforward. Certainly that's all you really need to know about error handling for this tutorial!
Express 5 automatically catches and forwards exceptions that are thrown in synchronous code:
js
Copy to Clipboard
app.get("/", (req, res) => {
  // Express will catch this
  throw new Error("SynchronousException");
});

However, you must catch() exceptions occurring in asynchronous code invoked by route handlers or middleware. These will not be caught by the default code:
js
Copy to Clipboard
app.get("/", (req, res, next) => {
  setTimeout(() => {
    try {
      // You must catch and propagate this error yourself
      throw new Error("AsynchronousException");
    } catch (err) {
      next(err);
    }
  }, 100);
});

Lastly, if you're using the older style of asynchronous methods that return an error or result in a callback function, then you need to propagate the error yourself. The following example shows how.
js
Copy to Clipboard
router.get("/about", (req, res, next) => {
  About.find({}).exec((err, queryResults) => {
    if (err) {
      // Propagate the error
      return next(err);
    }
    // Successful, so render
    res.render("about_view", { title: "About", list: queryResults });
  });
});

For more information see Error handling.
Routes needed for the LocalLibrary
The URLs that we're ultimately going to need for our pages are listed below, where object is replaced by the name of each of our models (book, bookinstance, genre, author), objects is the plural of object, and id is the unique instance field (_id) that is given to each Mongoose model instance by default.
catalog/ — The home/index page.
catalog/<objects>/ — The list of all books, bookinstances, genres, or authors (e.g., /catalog/books/, /catalog/genres/, etc.)
catalog/<object>/<id> — The detail page for a specific book, bookinstance, genre, or author with the given _id field value (e.g., /catalog/book/584493c1f4887f06c0e67d37).
catalog/<object>/create — The form to create a new book, bookinstance, genre, or author (e.g., /catalog/book/create).
catalog/<object>/<id>/update — The form to update a specific book, bookinstance, genre, or author with the given _id field value (e.g., /catalog/book/584493c1f4887f06c0e67d37/update).
catalog/<object>/<id>/delete — The form to delete a specific book, bookinstance, genre, or author with the given _id field value (e.g., /catalog/book/584493c1f4887f06c0e67d37/delete).
The first home page and list pages don't encode any additional information. While the results returned will depend on the model type and the content in the database, the queries run to get the information will always be the same (similarly the code run for object creation will always be similar).
By contrast the other URLs are used to act on a specific document/model instance—these encode the identity of the item in the URL (shown as <id> above). We'll use path parameters to extract the encoded information and pass it to the route handler (and in a later article we'll use this to dynamically determine what information to get from the database). By encoding the information in our URL we only need one route for every resource of a particular type (e.g., one route to handle the display of every single book item).
Note: Express allows you to construct your URLs any way you like — you can encode information in the body of the URL as shown above or use URL GET parameters (e.g., /book/?id=6). Whichever approach you use, the URLs should be kept clean, logical and readable (check out the W3C advice here).
Next we create our route handler callback functions and route code for all the above URLs.
Create the route-handler callback functions
Before we define our routes, we'll first create all the dummy/skeleton callback functions that they will invoke. The callbacks will be stored in separate "controller" modules for Book, BookInstance, Genre, and Author (you can use any file/module structure, but this seems an appropriate granularity for this project).
Start by creating a folder for our controllers in the project root (/controllers) and then create separate controller files/modules for handling each of the models:
/express-locallibrary-tutorial  # the project root
  /controllers
    authorController.js
    bookController.js
    bookinstanceController.js
    genreController.js

Author controller
Open the /controllers/authorController.js file and type in the following code:
js
Copy to Clipboard
const Author = require("../models/author");

// Display list of all Authors.
exports.author_list = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author list");
};

// Display detail page for a specific Author.
exports.author_detail = async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Author detail: ${req.params.id}`);
};

// Display Author create form on GET.
exports.author_create_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author create GET");
};

// Handle Author create on POST.
exports.author_create_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author create POST");
};

// Display Author delete form on GET.
exports.author_delete_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
};

// Handle Author delete on POST.
exports.author_delete_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
};

// Display Author update form on GET.
exports.author_update_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST.
exports.author_update_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update POST");
};

The module first requires the Author model that we'll later be using to access and update our data. It then exports functions for each of the URLs we wish to handle. Note that the create, update and delete operations use forms, and hence also have additional methods for handling form post requests — we'll discuss those methods in the "forms article" later on.
The functions respond with a string indicating that the associated page has not yet been created. If a controller function is expected to receive path parameters, these are output in the message string (see req.params.id above).
BookInstance controller
Open the /controllers/bookinstanceController.js file and copy in the following code (this follows an identical pattern to the Author controller module):
js
Copy to Clipboard
const BookInstance = require("../models/bookinstance");

// Display list of all BookInstances.
exports.bookinstance_list = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance list");
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: BookInstance detail: ${req.params.id}`);
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance create GET");
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance create POST");
};

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete POST");
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
};

Genre controller
Open the /controllers/genreController.js file and copy in the following text (this follows an identical pattern to the Author and BookInstance files):
js
Copy to Clipboard
const Genre = require("../models/genre");

// Display list of all Genre.
exports.genre_list = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre list");
};

// Display detail page for a specific Genre.
exports.genre_detail = async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Genre detail: ${req.params.id}`);
};

// Display Genre create form on GET.
exports.genre_create_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create GET");
};

// Handle Genre create on POST.
exports.genre_create_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create POST");
};

// Display Genre delete form on GET.
exports.genre_delete_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
};

// Handle Genre delete on POST.
exports.genre_delete_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
};

// Display Genre update form on GET.
exports.genre_update_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
exports.genre_update_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
};

Book controller
Open the /controllers/bookController.js file and copy in the following code. This follows the same pattern as the other controller modules, but additionally has an index() function for displaying the site welcome page:
js
Copy to Clipboard
const Book = require("../models/book");

exports.index = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
};

// Display list of all books.
exports.book_list = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book list");
};

// Display detail page for a specific book.
exports.book_detail = async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
};

// Display book create form on GET.
exports.book_create_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book create GET");
};

// Handle book create on POST.
exports.book_create_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book create POST");
};

// Display book delete form on GET.
exports.book_delete_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
};

// Handle book delete on POST.
exports.book_delete_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
};

// Display book update form on GET.
exports.book_update_get = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update GET");
};

// Handle book update on POST.
exports.book_update_post = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update POST");
};

Create the catalog route module
Next we create routes for all the URLs needed by the LocalLibrary website, which will call the controller functions we defined in the previous sections.
The skeleton already has a ./routes folder containing routes for the index and users. Create another route file — catalog.js — inside this folder, as shown.
/express-locallibrary-tutorial # the project root
  /routes
    index.js
    users.js
    catalog.js

Open /routes/catalog.js and copy in the code below:
js
Copy to Clipboard
const express = require("express");

// Require controller modules.
const book_controller = require("../controllers/bookController");
const author_controller = require("../controllers/authorController");
const genre_controller = require("../controllers/genreController");
const book_instance_controller = require("../controllers/bookinstanceController");

const router = express.Router();

/// BOOK ROUTES ///

// GET catalog home page.
router.get("/", book_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/book/create", book_controller.book_create_get);

// POST request for creating Book.
router.post("/book/create", book_controller.book_create_post);

// GET request to delete Book.
router.get("/book/:id/delete", book_controller.book_delete_get);

// POST request to delete Book.
router.post("/book/:id/delete", book_controller.book_delete_post);

// GET request to update Book.
router.get("/book/:id/update", book_controller.book_update_get);

// POST request to update Book.
router.post("/book/:id/update", book_controller.book_update_post);

// GET request for one Book.
router.get("/book/:id", book_controller.book_detail);

// GET request for list of all Book items.
router.get("/books", book_controller.book_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get("/author/create", author_controller.author_create_get);

// POST request for creating Author.
router.post("/author/create", author_controller.author_create_post);

// GET request to delete Author.
router.get("/author/:id/delete", author_controller.author_delete_get);

// POST request to delete Author.
router.post("/author/:id/delete", author_controller.author_delete_post);

// GET request to update Author.
router.get("/author/:id/update", author_controller.author_update_get);

// POST request to update Author.
router.post("/author/:id/update", author_controller.author_update_post);

// GET request for one Author.
router.get("/author/:id", author_controller.author_detail);

// GET request for list of all Authors.
router.get("/authors", author_controller.author_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genre_controller.genre_create_get);

// POST request for creating Genre.
router.post("/genre/create", genre_controller.genre_create_post);

// GET request to delete Genre.
router.get("/genre/:id/delete", genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET request to update Genre.
router.get("/genre/:id/update", genre_controller.genre_update_get);

// POST request to update Genre.
router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET request for one Genre.
router.get("/genre/:id", genre_controller.genre_detail);

// GET request for list of all Genre.
router.get("/genres", genre_controller.genre_list);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get(
  "/bookinstance/create",
  book_instance_controller.bookinstance_create_get,
);

// POST request for creating BookInstance.
router.post(
  "/bookinstance/create",
  book_instance_controller.bookinstance_create_post,
);

// GET request to delete BookInstance.
router.get(
  "/bookinstance/:id/delete",
  book_instance_controller.bookinstance_delete_get,
);

// POST request to delete BookInstance.
router.post(
  "/bookinstance/:id/delete",
  book_instance_controller.bookinstance_delete_post,
);

// GET request to update BookInstance.
router.get(
  "/bookinstance/:id/update",
  book_instance_controller.bookinstance_update_get,
);

// POST request to update BookInstance.
router.post(
  "/bookinstance/:id/update",
  book_instance_controller.bookinstance_update_post,
);

// GET request for one BookInstance.
router.get("/bookinstance/:id", book_instance_controller.bookinstance_detail);

// GET request for list of all BookInstance.
router.get("/bookinstances", book_instance_controller.bookinstance_list);

module.exports = router;

The module requires Express and then uses it to create a Router object. The routes are all set up on the router, which is then exported.
The routes are defined either using .get() or .post() methods on the router object. All the paths are defined using strings (we don't use string patterns or regular expressions). Routes that act on some specific resource (e.g., book) use path parameters to get the object id from the URL.
The handler functions are all imported from the controller modules we created in the previous section.
Update the index route module
We've set up all our new routes, but we still have a route to the original page. Let's instead redirect this to the new index page that we've created at the path /catalog.
Open /routes/index.js and replace the existing route with the function below.
js
Copy to Clipboard
// GET home page.
router.get("/", (req, res) => {
  res.redirect("/catalog");
});

Note: This is our first use of the redirect() response method. This redirects to the specified page, by default sending HTTP status code "302 Found". You can change the status code returned if needed, and supply either absolute or relative paths.
Update app.js
The last step is to add the routes to the middleware chain. We do this in app.js.
Open app.js and require the catalog route below the other routes (add the third line shown below, underneath the other two that should be already present in the file):
js
Copy to Clipboard
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog"); // Import routes for "catalog" area of site

Next, add the catalog route to the middleware stack below the other routes (add the third line shown below, underneath the other two that should be already present in the file):
js
Copy to Clipboard
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter); // Add catalog routes to middleware chain.

Note: We have added our catalog module at a path /catalog. This is prepended to all of the paths defined in the catalog module. So for example, to access a list of books, the URL will be: /catalog/books/.
That's it. We should now have routes and skeleton functions enabled for all the URLs that we will eventually support on the LocalLibrary website.
Testing the routes
To test the routes, first start the website using your usual approach
The default method
bash
Copy to Clipboard
# Windows
SET DEBUG=express-locallibrary-tutorial:* & npm start

# macOS or Linux
DEBUG=express-locallibrary-tutorial:* npm start


If you previously set up nodemon, you can instead use:
bash
Copy to Clipboard
npm run serverstart


Then navigate to a number of LocalLibrary URLs, and verify that you don't get an error page (HTTP 404). A small set of URLs are listed below for your convenience:
http://localhost:3000/
http://localhost:3000/catalog
http://localhost:3000/catalog/books
http://localhost:3000/catalog/bookinstances/
http://localhost:3000/catalog/authors/
http://localhost:3000/catalog/genres/
http://localhost:3000/catalog/book/5846437593935e2f8c2aa226
http://localhost:3000/catalog/book/create
Summary
We've now created all the routes for our site, along with dummy controller functions that we can populate with a full implementation in later articles. Along the way we've learned a lot of fundamental information about Express routes, handling exceptions, and some approaches for structuring our routes and controllers.
In our next article we'll create a proper welcome page for the site, using views (templates) and information stored in our models.
See also
Basic routing (Express docs)
Routing guide (Express docs)
Express Tutorial Part 5: Displaying library data
Previous


Overview: Express web framework (Node.js/JavaScript)


Next


We're now ready to add the pages that display the LocalLibrary website books and other data. The pages will include a home page that shows how many records we have of each model type and list and detail pages for all of our models. Along the way, we'll gain practical experience in getting records from the database, and using templates.
Prerequisites:
Complete previous tutorial topics (including Express Tutorial Part 4: Routes and controllers).
Objective:
To understand how to perform asynchronous database operations using async/await, how to use the Pug template language, and how to get data from the URL in our controller functions.

Overview
In our previous tutorial articles, we defined Mongoose models that we can use to interact with a database and created some initial library records. We then created all the routes needed for the LocalLibrary website, but with "dummy controller" functions (these are skeleton controller functions that just return a "not implemented" message when a page is accessed).
The next step is to provide proper implementations for the pages that display our library information (we'll look at implementing pages featuring forms to create, update, or delete information in later articles). This includes updating the controller functions to fetch records using our models and defining templates to display this information to users.
We will start by providing overview/primer topics explaining how to manage asynchronous operations in controller functions and how to write templates using Pug. Then we'll provide implementations for each of our main "read-only" pages with a brief explanation of any special or new features that they use.
At the end of this article, you should have a good end-to-end understanding of how routes, asynchronous functions, views, and models work in practice.
Displaying library data tutorial subarticles
The following subarticles go through the process of adding the different features required for us to display the required website pages. You need to read and work through each one of these in turn, before moving on to the next one.
Template primer
The LocalLibrary base template
Home page
Book list page
BookInstance list page
Date formatting using luxon
Author list page and Genre list page challenge
Genre detail page
Book detail page
Author detail page
BookInstance detail page and challenge
Summary
We've now created all the "read-only" pages for our site: a home page that displays counts of instances of each of our models, and list and detail pages for our books, book instances, authors, and genres. Along the way, we've gained a lot of fundamental knowledge about controllers, managing flow control when using asynchronous operations, creating views using Pug, querying the site's database using models, passing information to a view, and creating and extending templates. The challenges will also have taught readers a little about date handling using Luxon.
In our next article, we'll build on our knowledge, creating HTML forms and form handling code to start modifying the data stored by the site.
See also
Using Template engines with Express (Express docs)
Pug (Pug docs)
Luxon (Luxon docs)
Express Tutorial Part 6: Working with forms
Previous


Overview: Express web framework (Node.js/JavaScript)


Next


In this tutorial we'll show you how to work with HTML Forms in Express using Pug. In particular, we'll discuss how to write forms to create, update, and delete documents from the site's database.
Prerequisites:
Complete all previous tutorial topics, including Express Tutorial Part 5: Displaying library data
Objective:
To understand how to write forms to get data from users, and update the database with this data.

Overview
An HTML Form is a group of one or more fields/widgets on a web page that can be used to collect information from users for submission to a server. Forms are a flexible mechanism for collecting user input because there are suitable form inputs available for entering many different types of data—text boxes, checkboxes, radio buttons, date pickers, etc. Forms are also a relatively secure way of sharing data with the server, as they allow us to send data in POST requests with cross-site request forgery protection.
Working with forms can be complicated! Developers need to write HTML for the form, validate and properly sanitize entered data on the server (and possibly also in the browser), repost the form with error messages to inform users of any invalid fields, handle the data when it has successfully been submitted, and finally respond to the user in some way to indicate success.
In this tutorial, we're going to show you how the above operations may be performed in Express. Along the way, we'll extend the LocalLibrary website to allow users to create, edit and delete items from the library.
Note: We haven't looked at how to restrict particular routes to authenticated or authorized users, so at this point, any user will be able to make changes to the database.
HTML Forms
First a brief overview of HTML Forms. Consider a simple HTML form, with a single text field for entering the name of some "team", and its associated label:

The form is defined in HTML as a collection of elements inside <form>…</form> tags, containing at least one input element of type="submit".
html
Copy to Clipboard
<form action="/team_name_url/" method="post">
  <label for="team_name">Enter name: </label>
  <input
    id="team_name"
    type="text"
    name="name_field"
    value="Default name for team." />
  <input type="submit" value="OK" />
</form>

While here we have included just one (text) field for entering the team name, a form may contain any number of other input elements and their associated labels. The field's type attribute defines what sort of widget will be displayed. The name and id of the field are used to identify the field in JavaScript/CSS/HTML, while value defines the initial value for the field when it is first displayed. The matching team label is specified using the label tag (see "Enter name" above), with a for field containing the id value of the associated input.
The submit input will be displayed as a button (by default)—this can be pressed by the user to upload the data contained by the other input elements to the server (in this case, just the team_name). The form attributes define the HTTP method used to send the data and the destination of the data on the server (action):
action: The resource/URL where data is to be sent for processing when the form is submitted. If this is not set (or set to an empty string), then the form will be submitted back to the current page URL.
method: The HTTP method used to send the data: POST or GET.
The POST method should always be used if the data is going to result in a change to the server's database, because this can be made more resistant to cross-site forgery request attacks.
The GET method should only be used for forms that don't change user data (e.g., a search form). It is recommended for when you want to be able to bookmark or share the URL.
Form handling process
Form handling uses all of the same techniques that we learned for displaying information about our models: the route sends our request to a controller function which performs any database actions required, including reading data from the models, then generates and returns an HTML page. What makes things more complicated is that the server also needs to be able to process the data provided by the user, and redisplay the form with error information if there are any problems.
A process flowchart for processing form requests is shown below, starting with a request for a page containing a form (shown in green):

As shown in the diagram above, the main things that form handling code needs to do are:
Display the default form the first time it is requested by the user.
The form may contain blank fields (e.g., if you're creating a new record), or it may be pre-populated with initial values (e.g., if you are changing a record, or have useful default initial values).
Receive data submitted by the user, usually in an HTTP POST request.
Validate and sanitize the data.
If any data is invalid, re-display the form—this time with any user populated values and error messages for the problem fields.
If all data is valid, perform required actions (e.g., save the data in the database, send a notification email, return the result of a search, upload a file, etc.)
Once all actions are complete, redirect the user to another page.
Often form handling code is implemented using a GET route for the initial display of the form and a POST route to the same path for handling validation and processing of form data. This is the approach that will be used in this tutorial.
Express itself doesn't provide any specific support for form handling operations, but it can use middleware to process POST and GET parameters from the form, and to validate/sanitize their values.
Validation and sanitization
Before the data from a form is stored it must be validated and sanitized:
Validation checks that entered values are appropriate for each field (are in the right range, format, etc.) and that values have been supplied for all required fields.
Sanitization removes/replaces characters in the data that might potentially be used to send malicious content to the server.
For this tutorial, we'll be using the popular express-validator module to perform both validation and sanitization of our form data.
Installation
Install the module by running the following command in the root of the project.
bash
Copy to Clipboard
npm install express-validator

Using express-validator
Note: The express-validator guide on GitHub provides a good overview of the API. We recommend you read that to get an idea of all its capabilities (including using schema validation and creating custom validators). Below we cover just a subset that is useful for the LocalLibrary.
To use the validator in our controllers, we specify the particular functions we want to import from the express-validator module, as shown below:
js
Copy to Clipboard
const { body, validationResult } = require("express-validator");

There are many functions available, allowing you to check and sanitize data from request parameters, body, headers, cookies, etc., or all of them at once. For this tutorial, we'll primarily be using body and validationResult (as "required" above).
The functions are defined as below:
body(fields, message): Specifies a set of fields in the request body (a POST parameter) to validate and/or sanitize along with an optional error message that can be displayed if it fails the tests. The validation and sanitize criteria are daisy-chained to the body() method.
For example, the line below first defines that we're checking the "name" field and that a validation error will set an error message "Empty name". We then call the sanitization method trim() to remove whitespace from the start and end of the string, and then isLength() to check the resulting string isn't empty. Finally, we call escape() to remove HTML characters from the variable that might be used in JavaScript cross-site scripting attacks.
js
Copy to Clipboard
[
  // …
  body("name", "Empty name").trim().isLength({ min: 1 }).escape(),
  // …
];
This test checks that the age field is a valid date and uses optional() to specify that null and empty strings will not fail validation.
js
Copy to Clipboard
[
  // …
  body("age", "Invalid age")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  // …
];
You can also daisy chain different validators, and add messages that are displayed if the preceding validators are false.
js
Copy to Clipboard
[
  // …
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name empty.")
    .isAlpha()
    .withMessage("Name must be alphabet letters."),
  // …
];


validationResult(req): Runs the validation, making errors available in the form of a validation result object. This is invoked in a separate callback, as shown below:
js
Copy to Clipboard
async (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // There are errors. Render form again with sanitized values/errors messages.
    // Error messages can be returned in an array using `errors.array()`.
  } else {
    // Data from form is valid.
  }
};
We use the validation result's isEmpty() method to check if there were errors, and its array() method to get the set of error messages. See the Handling validation section for more information.
The validation and sanitization chains are middleware that should be passed to the Express route handler (we do this indirectly, via the controller). When the middleware runs, each validator/sanitizer is run in the order specified.
We'll cover some real examples when we implement the LocalLibrary forms below.
Form design
Many of the models in the library are related/dependent—for example, a Book requires an Author, and may also have one or more Genres. This raises the question of how we should handle the case where a user wishes to:
Create an object when its related objects do not yet exist (for example, a book where the author object hasn't been defined).
Delete an object that is still being used by another object (so for example, deleting a Genre that is still being used by a Book).
For this project we will simplify the implementation by stating that a form can only:
Create an object using objects that already exist (so users will have to create any required Author and Genre instances before attempting to create any Book objects).
Delete an object if it is not referenced by other objects (so for example, you won't be able to delete a Book until all associated BookInstance objects have been deleted).
Note: A more flexible implementation might allow you to create the dependent objects when creating a new object, and delete any object at any time (for example, by deleting dependent objects, or by removing references to the deleted object from the database).
Routes
In order to implement our form handling code, we will need two routes that have the same URL pattern. The first (GET) route is used to display a new empty form for creating the object. The second route (POST) is used for validating data entered by the user, and then saving the information and redirecting to the detail page (if the data is valid) or redisplaying the form with errors (if the data is invalid).
We have already created the routes for all our model's create pages in /routes/catalog.js (in a previous tutorial). For example, the genre routes are shown below:
js
Copy to Clipboard
// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genre_controller.genre_create_get);

// POST request for creating Genre.
router.post("/genre/create", genre_controller.genre_create_post);

Express forms subarticles
The following sub articles will take us through the process of adding the required forms to our example application. You need to read and work through each one in turn, before moving on to the next one.
Create Genre form — Defining a page to create Genre objects.
Create Author form — Defining a page to create Author objects.
Create Book form — Defining a page/form to create Book objects.
Create BookInstance form — Defining a page/form to create BookInstance objects.
Delete Author form — Defining a page to delete Author objects.
Update Book form — Defining page to update Book objects.
Challenge yourself
Implement the delete pages for the Book, BookInstance, and Genre models, linking them from the associated detail pages in the same way as our Author delete page. The pages should follow the same design approach:
If there are references to the object from other objects, then these other objects should be displayed along with a note that this record can't be deleted until the listed objects have been deleted.
If there are no other references to the object then the view should prompt to delete it. If the user presses the Delete button, the record should then be deleted.
A few tips:
Deleting a Genre is just like deleting an Author, as both objects are dependencies of Book (so in both cases you can delete the object only when the associated books are deleted).
Deleting a Book is also similar as you need to first check that there are no associated BookInstances.
Deleting a BookInstance is the easiest of all because there are no dependent objects. In this case, you can just find the associated record and delete it.
Implement the update pages for the BookInstance, Author, and Genre models, linking them from the associated detail pages in the same way as our Book update page.
A few tips:
The Book update page we just implemented is the hardest! The same patterns can be used for the update pages for the other objects.
The Author date of death and date of birth fields and the BookInstance due_date field are the wrong format to input into the date input field on the form (it requires data in form "YYYY-MM-DD"). The easiest way to get around this is to define a new virtual property for the dates that formats the dates appropriately, and then use this field in the associated view templates.
If you get stuck, there are examples of the update pages in the example here.
Summary
Express, node, and third-party packages on npm provide everything you need to add forms to your website. In this article, you've learned how to create forms using Pug, validate and sanitize input using express-validator, and add, delete, and modify records in the database.
You should now understand how to add basic forms and form-handling code to your own node websites!
See also
express-validator (npm docs).
Express Tutorial Part 7: Deploying to production
Previous


Overview: Express web framework (Node.js/JavaScript)


Now that you've created and tested a sample website using Express, it's time to deploy it to a web server so people can access it over the public internet. This page explains how to host an Express project and outlines what you need to get it ready for production.
Prerequisites:
Complete all previous tutorial topics, including Express Tutorial Part 6: Working with forms.
Objective:
To learn where and how you can deploy an Express app to production.


Overview
Once your site is finished (or finished "enough" to start public testing) you're going to need to host it somewhere more public and accessible than your personal development computer.
Up to now, you've been working in a development environment, using Express/Node as a web server to share your site to the local browser/network, and running your website with (insecure) development settings that expose debugging and other private information. Before you can host a website externally you're first going to have to:
Choose an environment for hosting the Express app.
Make a few changes to your project settings.
Set up a production-level infrastructure for serving your website.
This tutorial provides some guidance on your options for choosing a hosting site, a brief overview of what you need to do in order to get your Express app ready for production, and a working example of how to install the LocalLibrary website onto the Railway cloud hosting service.
What is a production environment?
The production environment is the environment provided by the server computer where you will run your website for external consumption. The environment includes:
Computer hardware on which the website runs.
Operating system (e.g., Linux or Windows).
Programming language runtime and framework libraries on top of which your website is written.
Web server infrastructure, possibly including a web server, reverse proxy, load balancer, etc.
Databases on which your website is dependent.
The server computer could be located on your premises and connected to the Internet by a fast link, but it is far more common to use a computer that is hosted "in the cloud". What this actually means is that your code is run on some remote computer (or possibly a "virtual" computer) in your hosting company's data center(s). The remote server will usually offer some guaranteed level of computing resources (e.g., CPU, RAM, storage memory, etc.) and Internet connectivity for a certain price.
This sort of remotely accessible computing/networking hardware is referred to as Infrastructure as a Service (IaaS). Many IaaS vendors provide options to preinstall a particular operating system, onto which you must install the other components of your production environment. Other vendors allow you to select more fully-featured environments, perhaps including a complete Node setup.
Note: Pre-built environments can make setting up your website easier because they reduce the required configuration, but the available options may limit you to an unfamiliar server (or other components) and may be based on an older version of the OS. Often it is better to install components yourself so that you get the ones that you want, and when you need to upgrade parts of the system, you have some idea of where to start!
Other hosting providers support Express as part of a Platform as a Service (PaaS) offering. When using this sort of hosting you don't need to worry about most of your production environment (servers, load balancers, etc.) as the host platform takes care of those for you. That makes deployment quite straightforward because you just need to concentrate on your web application and not any other server infrastructure.
Some developers will choose the increased flexibility provided by IaaS over PaaS, while others will appreciate the reduced maintenance overhead and scaling effort of PaaS. When you're getting started, setting up your website on a PaaS system is much easier, so that is what we'll do in this tutorial.
Note: If you choose a Node/Express-friendly hosting provider they should provide instructions on how to set up an Express website using different configurations of web server, application server, reverse proxy, etc. For example, there are many step-by-step guides for various configurations in the DigitalOcean Node community docs.
Choosing a hosting provider
There are numerous hosting providers that are known to either actively support or work well with Node (and Express). These vendors provide different types of environments (IaaS, PaaS), and different levels of computing and network resources at different prices.
Note: There are a lot of hosting solutions, and their services and pricing can change over time. While we introduce a few options below, it is worth checking both these and other options before selecting a hosting provider.
Some of the things to consider when choosing a host:
How busy your site is likely to be and the cost of data and computing resources required to meet that demand.
Level of support for scaling horizontally (adding more machines) and vertically (upgrading to more powerful machines) and the costs of doing so.
The locations where the supplier has data centers, and hence where access is likely to be fastest.
The host's historical uptime and downtime performance.
Tools provided for managing the site — are they easy to use and are they secure (e.g., SFTP vs. FTP).
Inbuilt frameworks for monitoring your server.
Known limitations. Some hosts will deliberately block certain services (e.g., email). Others offer only a certain number of hours of "live time" in some price tiers, or only offer a small amount of storage.
Additional benefits. Some providers will offer free domain names and support for TLS certificates that you would otherwise have to pay for.
Whether the "free" tier you're relying on expires over time, and whether the cost of migrating to a more expensive tier means you would have been better off using some other service in the first place!
The good news when you're starting out is that there are quite a few sites that provide "free" computing environments that are intended for evaluation and testing. These are usually fairly resource constrained/limited environments, and you do need to be aware that they may expire after some introductory period or have other constraints. They are however great for testing low-traffic sites in a hosted environment, and can provide an easy migration to paying for more resources when your site gets busier. Popular choices in this category include Amazon Web Services and Microsoft Azure.
Most providers also offer a "basic" or "hobby" tier that is intended for small production sites, and which provide more useful levels of computing power and fewer limitations. Railway, Heroku, and DigitalOcean are examples of popular hosting providers that have a relatively inexpensive basic computing tier (in the $5 to $10 USD per month range).
Note: Remember that price is not the only selection criterion. If your website is successful, it may turn out that scalability is the most important consideration.
Getting your website ready to publish
The main things to think about when publishing your website are web security and performance. At the bare minimum, you will want to modify the database configuration so that you can use a different database for production and secure its credentials, remove the stack traces that are included on error pages during development, tidy up your logging, and set the appropriate headers to avoid many common security threats.
In the following subsections, we outline the most important changes that you should make to your app.
Note: There are other useful tips in the Express docs — see Production best practices: performance and reliability and Production Best Practices: Security.
Database configuration
So far in this tutorial, we've used a single development database, for which the address and credentials were hard-coded into bin/www. Since the development database doesn't contain any information that we mind being exposed or corrupted, there is no particular risk in leaking these details. However if you're working with real data, in particular personal user information, then it is very important to protect your database credentials.
For this reason we want to use a different database for production than we use for development, and also keep the production database credentials separate from the source code so that they can be properly protected.
If your hosting provider supports setting environment variables through a web interface (as many do), one way to do this is to have the server get the database URL from an environment variable. Below we modify the LocalLibrary website to get the database URI from an OS environment variable, if it has been defined, and otherwise use the development database URL.
Open bin.www and find the line that sets the MongoDB connection variable. It will look something like this:
js
Copy to Clipboard
const mongoDB =
  "mongodb+srv://your_user_name:your_password@cluster0.cojoign.mongodb.net/local_library?retryWrites=true&w=majority";
Replace the line with the following code that uses process.env.MONGODB_URI to get the connection string from an environment variable named MONGODB_URI if has been set (use your own database URL instead of the placeholder below).
js
Copy to Clipboard
const dev_db_url =
  "mongodb+srv://your_user_name:your_password@cluster0.cojoign.mongodb.net/local_library?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
Note: Another common way to keep production database credentials separate from source code is to read them from an .env file that is separately deployed to the file system (for example, they might be read using the dotenv module from npm).
Set NODE_ENV to 'production'
We can remove stack traces in error pages by setting the NODE_ENV environment variable to production (it is set to 'development' by default). In addition to generating less-verbose error messages, setting the variable to production caches view templates and CSS files generated from CSS extensions. Tests indicate that setting NODE_ENV to production can improve app performance by a factor of three!
This change can be made either by using export, an environment file, or the OS initialization system.
Note: This is actually a change you make in your environment setup rather than your app, but important enough to note here! We'll show how this is set for our hosting example below.
Log appropriately
Logging calls can have an impact on a high-traffic website. In a production environment, you may need to log website activity (e.g., tracking traffic or logging API calls) but you should attempt to minimize the amount of logging added for debugging purposes.
One way to minimize "debug" logging in production is to use a module like debug that allows you to control what logging is performed by setting an environment variable. For example, the code fragment below shows how you might set up "author" logging. The debug variable is declared with the name 'author', and the prefix "author" will be automatically displayed for all logs from this object.
js
Copy to Clipboard
const debug = require("debug")("author");

// Display Author update form on GET.
exports.author_update_get = async (req, res, next) => {
  const author = await Author.findById(req.params.id).exec();
  if (author === null) {
    // No results.
    debug(`id not found on update: ${req.params.id}`);
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author_form", { title: "Update Author", author });
};
You can then enable a particular set of logs by specifying them as a comma-separated list in the DEBUG environment variable. You can set the variables for displaying author and book logs as shown (wildcards are also supported).
bash
Copy to Clipboard
#Windows
set DEBUG=author,book

#Linux
export DEBUG="author,book"
Note: Calls to debug can replace logging you might previously have done using console.log() or console.error(). Replace any console.log() calls in your code with logging via the debug module. Turn the logging on and off in your development environment by setting the DEBUG variable and observe the impact this has on logging.
If you need to log website activity you can use a logging library like Winston or Bunyan. For more information on this topic see: Production best practices: performance and reliability.
Use gzip/deflate compression for responses
Web servers can often compress the HTTP response sent back to a client, significantly reducing the time required for the client to get and load the page. The compression method used will depend on the decompression methods the client says it supports in the request (the response will be sent uncompressed if no compression methods are supported).
Add this to your site using compression middleware. Install this at the root of your project by running the following command:
bash
Copy to Clipboard
npm install compression
Open ./app.js and require the compression library as shown. Add the compression library to the middleware chain with the use() method (this should appear before any routes you want compressed — in this case, all of them!)
js
Copy to Clipboard
const catalogRouter = require("./routes/catalog"); // Import routes for "catalog" area of site
const compression = require("compression");

// Create the Express application object
const app = express();

// …

app.use(compression()); // Compress all routes

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter); // Add catalog routes to middleware chain.

// …
Note: For a high-traffic website in production you wouldn't use this middleware. Instead, you would use a reverse proxy like Nginx.
Use Helmet to protect against well known vulnerabilities
Helmet is a middleware package. It can set appropriate HTTP headers that help protect your app from well-known web vulnerabilities (see the docs for more information on what headers it sets and vulnerabilities it protects against).
Install this at the root of your project by running the following command:
bash
Copy to Clipboard
npm install helmet
Open ./app.js and require the helmet library as shown. Then add the module to the middleware chain with the use() method.
js
Copy to Clipboard
const compression = require("compression");
const helmet = require("helmet");

// Create the Express application object
const app = express();

// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and jQuery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "cdn.jsdelivr.net"],
    },
  }),
);

// …
We normally might have just inserted app.use(helmet()); to add the subset of the security-related headers that make sense for most sites. However in the LocalLibrary base template we include some bootstrap scripts. These violate the helmet's default Content Security Policy (CSP), which does not allow loading of cross-site scripts. To allow these scripts to be loaded we modify the helmet configuration so that it sets CSP directives to allow script loading from the indicated domains. For your own server you can add/disable specific headers as needed by following the instructions for using helmet here.
Add rate limiting to the API routes
Express-rate-limit is a middleware package that can be used to limit repeated requests to APIs and endpoints. There are many reasons why excessive requests might be made to your site, such as denial of service attacks, brute force attacks, or even just a client or script that is not behaving as expected. Aside from performance issues that can arise from too many requests causing your server to slow down, you may also be charged for the additional traffic. This package can be used to limit the number of requests that can be made to a particular route or set of routes.
Install this at the root of your project by running the following command:
bash
Copy to Clipboard
npm install express-rate-limit
Open ./app.js and require the express-rate-limit library as shown. Then add the module to the middleware chain with the use() method.
js
Copy to Clipboard
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

const app = express();

// Set up rate limiter: maximum of twenty requests per minute
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

// …
The command above limits all requests to 20 per minute (you can change this as needed).
Note: Third-party services like Cloudflare can also be used if you need more advanced protection against denial of service or other types of attacks.
Set node version
For node applications, including Express, the package.json file contains everything a hosting provider should need to work out the application dependencies and entry point file.
The only important information missing from our current package.json is the version of node required by the library. You can find the version of node that was used for development by entering the command:
bash
Copy to Clipboard
>node --version
v16.17.1
Open package.json, and add this information as an engines > node as shown (using the version number for your system).
json
Copy to Clipboard
 "engines": {
    "node": ">=22.0.0"
  },
The hosting service might not support the specific indicated version of node, but this change should ensure that it attempts to use a version with the same major version number, or a more recent version.
Note that there may be other ways to specify the node version on different hosting services, but the package.json approach is widely supported.
Get dependencies and re-test
Before we proceed, let's test the site again and make sure it wasn't affected by any of our changes.
First, we will need to fetch our dependencies. You can do this by running the following command in your terminal at the root of the project:
bash
Copy to Clipboard
npm install
Now run the site (see Testing the routes for the relevant commands) and check that the site still behaves as you expect.
Creating an application repository in GitHub
Many hosting services allow you to import and/or synchronize projects from a local repository or from cloud-based source version control platforms. This can make deployment and iterative development much easier.
For this tutorial we'll set up a GitHub account and repository for the library, and use the git tool to upload our source code.
Note: You can skip this step if you're already using GitHub to manage your source code!
Note that using source code management tools is good software development practice, as it allows you to try out changes, and switch between your experiments and "known good code" when you need to!
The steps are:
Visit https://github.com/ and create an account.
Once you are logged in, click the + link in the top toolbar and select New repository.
Fill in all the fields on this form. While these are not compulsory, they are strongly recommended.
Enter a new repository name (e.g., express-locallibrary-tutorial), and description (such as "Local Library website written in Express").
Choose Node in the Add .gitignore selection list.
Choose your preferred license in the Add license selection list.
Check Initialize this repository with a README.
Warning: The default "Public" access will make all source code — including your database username and password — visible to anyone on the internet! Make sure the source code reads credentials only from environment variables and does not have any credentials hard-coded.
Otherwise, select the "Private" option to allow only selected people to see the source code.
Press Create repository.
Click the green Clone or download button on your new repo page.
Copy the URL value from the text field inside the dialog box that appears. If you used the repository name "express-locallibrary-tutorial", the URL should be something like: https://github.com/<your_git_user_id>/express-locallibrary-tutorial.git.
Now that the repository ("repo") is created on GitHub we are going to want to clone (copy) it to our local computer:
Install git for your local computer (official Git download guide).
Open a command prompt/terminal and clone your repo using the URL you copied above:
bash
Copy to Clipboard
git clone https://github.com/<your_git_user_id>/express-locallibrary-tutorial.git
This will create the repository inside the current directory.
Navigate into the repo folder.
bash
Copy to Clipboard
cd express-locallibrary-tutorial


Then copy your application source files into the repo folder, make them part of the repo using git, and upload them to GitHub:
Copy your Express application into this folder (excluding /node_modules, which contains dependency files that you should fetch from npm as needed).
Open a command prompt/terminal and use the add command to add all files to git.
bash
Copy to Clipboard
git add -A


Use the status command to check that all files you are about to commit are correct (you want to include source files, not binaries, temporary files etc.). It should look a bit like the listing below.
bash
Copy to Clipboard
git status
On branch main
Your branch is up-to-date with 'origin/main'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        new file:   ...


When you're satisfied, commit the files to your local repo. This is equivalent to signing off on the changes and making them an official part of the local repo.
bash
Copy to Clipboard
git commit -m "First version of application moved into GitHub"


At this point, the remote repo has not been changed. The last step is to synchronize (push) your local repo up to the remote GitHub repo using the following command:
bash
Copy to Clipboard
git push origin main


When this operation completes, you should be able to go back to the page on GitHub where you created your repo, refresh the page, and see that your whole application has now been uploaded. You can continue to update your repo as files change using this add/commit/push cycle.
This is a good point to make a backup of your "vanilla" project — while some of the changes we're going to be making in the following sections might be useful for deployment on any hosting service (or for development) others might not. You can do this using git on the command line:
bash
Copy to Clipboard
# Create branch vanilla_deployment from the current branch (main)
git checkout -b vanilla_deployment

# Push the new branch to GitHub
git push origin vanilla_deployment

# Switch back to main
git checkout main

# Make any further changes in a new branch
git pull upstream main # Merge the latest changes from GitHub
git checkout -b my_changes # Create a new branch
Note: Git is incredibly powerful! To learn more, see Learning Git.
Example: Hosting on Railway
This section provides a practical demonstration of how to install LocalLibrary on Railway.
Note: MDN has migrated this project from a number of hosting services that no longer offer free tiers. We've decided to use Railway for the current hosting option, which has an inexpensive hobby tier. Most services have similar deployment methods, so the instructions below should help you publish your project on the platform of your choice.
Why Railway?
Railway is an attractive hosting option for several reasons:
Railway takes care of most of the infrastructure so you don't have to. Not having to worry about servers, load balancers, reverse proxies, and so on, makes it much easier to get started.
Railway has a focus on developer experience for development and deployment, which leads to a faster and softer learning curve than many other alternatives.
The skills and concepts you will learn when using Railway are transferrable. While Railway has some excellent new features, other popular hosting services use many of the same ideas and approaches.
Railway documentation is clear and complete.
It has a comparably inexpensive Hobby Tier.
The service appears to be very reliable, and if you end up loving it, the pricing is predictable, and scaling your app is very easy.
You should take the time to determine if Railway is suitable for your own website.
How does Railway work?
Web applications are each run in their own isolated and independent virtualized container. To execute your application, Railway needs to be able to set up the appropriate environment and dependencies, and also understand how it is launched.
Railway makes this easy, as it can automatically recognize and install many different web application frameworks and environments based on their use of "common conventions". For example, Railway recognizes node applications because they have a package.json file, and can determine the package manager used for building from the "lock" file. For example, if the application includes the file package-lock.json Railway knows to use npm to install the packages, whereas if it finds yarn.lock it knows to use yarn. Having installed all the dependencies, Railway will look for scripts named "build" and "start" in the package file, and use these to build and run the code.
Note: Railway uses Nixpacks to recognize various web application frameworks written in different programming languages. You don't need to know anything else for this tutorial, but you can find out more about options for deploying node applications in Nixpacks Node.
Once the application is running it can configure itself using information provided in environment variables. For example, an application that uses a database must get the address using a variable. The database service itself may be hosted by Railway or some other provider.
Developers interact with Railway through the Railway site, and using a special Command Line Interface (CLI) tool. The CLI allows you to associate a local GitHub repository with a railway project, upload the repository from the local branch to the live site, inspect the logs of the running process, set and get configuration variables and much more. One of the most useful features is that you can use the CLI to run your local project with the same environment variables as the live project.
That's all the overview you need to deploy the app to Railway. Next we will set up a Railway account, install our website and a database, and try out the Railway client.
Get a Railway account
To start using Railway you will first need to create an account:
Go to railway.com and click the Login link in the top toolbar.
Select GitHub in the popup to login using your GitHub credentials
You may then need to go to your email and verify your account.
You'll then be logged in to the Railway.com dashboard: https://railway.com/dashboard.
Deploy on Railway from GitHub
Next we'll setup Railway to deploy our library from GitHub. First choose the Dashboard option from the site top menu, then select the New Project button:

Railway will display a list of options for the new project, including the option to deploy a project from a template that is first created in your GitHub account, and a number of databases. Select Deploy from GitHub repo.

All projects in the GitHub repos you shared with Railway during setup are displayed. Select your GitHub repository for the local library: <user-name>/express-locallibrary-tutorial.

Confirm your deployment by selecting Deploy Now.

Railway will then load and deploy your project, displaying progress on the deployments tab. When deployment successfully completes, you'll see a screen like the one below.

Now select the Settings tab, then scroll down to the Domains section, and press the Generate Domain button.

This will publish the site and put the domain in place of the button, as shown below.

Select the domain URL to open your library application. Note that because we haven't specified a production database, the local library will open using your development data.
Provision and connect a MongoDB database
Instead of using our development data, next let's create a production MongoDB database to use instead. We will create the database as part of the Railway application project, although there is nothing to stop you creating in its own separate project, or indeed to use a MongoDB Atlas database for production data, just as you have for the development database.
On Railway, choose the Dashboard option from the site top menu and then select your application project. At this stage it just contains a single service for your application (this can be selected to set variables and other details of the service). Select the New button, which is used to add services to the current project.

Select Database when prompted about the type of service to add:

Then select Add MongoDB to start adding the database

Railway will then provision a service containing an empty database in the same project. On completion you will now see both the application and database services in the project view.

Select the MongoDB service to display information about the database. Open the Variables tab and copy the "Mongo_URL" (this is the address of the database).

To make this accessible to the library application we need to add it to the application process using an environment variable. First open the application service. Then select the Variables tab and press the New Variable button.
Enter the variable name MONGODB_URI and the connection URL you copied for the database (MONGODB_URI is the name of the environment variable from which we configured the application to read the database address). This will look something like the screen shown below.

Select Add to add the variable.
Railway restarts your app when it updates variables. If you check the home page now it should show zero values for your object counts, as the changes above mean that we're now using a new (empty) database.
Other configuration variables
You will recall from a preceding section that we need to set NODE_ENV to 'production' in order to improve our performance and generate less-verbose error messages. We can do this in the same screen as we set the MONGODB_URI variable.
Open the application service. Then select the Variables tab, where you will see that MONGODB_URI is already defined, and press the New Variable button.

Enter NODE_ENV as the name of the new variable and production as the name of the environment. Then press the Add button.

The local library application is now setup and configured for production use. You can add data through the website interface and it should work in the same way that it did during development (though with less debug information exposed for invalid pages).
Note: If you just want to add some data for testing you might use the populatedb script (with your MongoDB production database URL) as discussed in the section Express Tutorial Part 3: Using a Database (with Mongoose) Testing — create some items.
Install the client
Download and install the Railway client for your local operating system by following the instructions here.
After the client is installed you will be able run commands. Some of the more important operations include deploying the current directory of your computer to an associated Railway project (without having to upload to GitHub), and running your project locally using the same settings as you have on the production server.
You can get a list of all the possible commands by entering the following in a terminal.
bash
Copy to Clipboard
railway help
Debugging
The Railway client provides the logs command to show the tail of logs (a more full log is available on the site for each project):
bash
Copy to Clipboard
railway logs
Summary
That's the end of this tutorial on setting up Express apps in production, and also the series of tutorials on working with Express. We hope you've found them useful. You can check out a fully worked-through version of the source code on GitHub here.
See also
Production best practices: performance and reliability (Express docs)
Production Best Practices: Security (Express docs)
Railway Docs
CLI
DigitalOcean
Express tutorials
Node.js tutorials
Heroku
Getting Started on Heroku with Node.js (Heroku docs)
Deploying Node.js Applications on Heroku (Heroku docs)
Heroku Node.js Support (Heroku docs)
Optimizing Node.js Application Concurrency (Heroku docs)
How Heroku works (Heroku docs)
Dynos and the Dyno Manager (Heroku docs)
Configuration and Config Vars (Heroku docs)
Limits (Heroku docs)
Previous




Handling common HTML and CSS problems
Previous


Overview: Testing


Next


With the scene set, we'll now look specifically at the common cross-browser problems you will come across in HTML and CSS code, and what tools can be used to prevent problems from happening, or fix problems that occur. This includes linting code, handling CSS prefixes, using browser dev tools to track down problems, using polyfills to add support into browsers, tackling responsive design problems, and more.
Prerequisites:
Familiarity with the core HTML, CSS, and JavaScript languages; an idea of the high level principles of cross browser testing.
Objective:
To be able to diagnose common HTML and CSS cross browser problems, and use appropriate tools and techniques to fix them.

The trouble with HTML and CSS
Some of the trouble with HTML and CSS lies with the fact that both languages are fairly simple, and often developers don't take them seriously, in terms of making sure the code is well-crafted, efficient, and semantically describes the purpose of the features on the page. In the worst cases, JavaScript is used to generate the entire web page content and style, which makes your pages inaccessible, and less performant (generating DOM elements is expensive). In other cases, nascent features are not supported consistently across browsers, which can make some features and styles not work for some users. Responsive design problems are also common — a site that looks good in a desktop browser might provide a terrible experience on a mobile device, because the content is too small to read, or perhaps the site is slow because of expensive animations.
Let's go forth and look at how we can reduce cross browser errors that result from HTML/CSS.
First things first: fixing general problems
We said in the first article of this series that a good strategy to begin with is to test in a couple of modern browsers on desktop/mobile, to make sure your code is working generally, before going on to concentrate on the cross browser issues.
In our Debugging HTML and Debugging CSS articles, we provided some really basic guidance on debugging HTML/CSS — if you are not familiar with the basics, you should definitely study these articles before carrying on.
Basically, it is a matter of checking whether your HTML and CSS code is well formed and doesn't contain any syntax errors.
Note: One common problem with CSS and HTML arises when different CSS rules begin to conflict with one another. This can be especially problematic when you are using third party code. For example, you might use a CSS framework and find that one of the class names it uses clashes with one you've already used for a different purpose. Or you might find that HTML generated by some kind of third party API (generating ad banners, for example) includes a class name or ID that you are already using for a different purpose. To ensure this doesn't happen, you need to research the tools you are using first and design your code around them. It is also worth "namespacing" CSS, e.g., if you have a widget, make sure it has a distinct class, and then start the selectors that select elements inside the widget with this class, so conflicts are less likely. For example .audio-player ul a.
Validation
For HTML, validation involves making sure all your tags are properly closed and nested, you are using a doctype, and you are using tags for their correct purpose. A good strategy is to validate your code regularly. One service that can do this is the W3C Markup Validation Service, which allows you to point to your code, and returns a list of errors:

CSS has a similar story — you need to check that your property names are spelled correctly, property values are spelled correctly and are valid for the properties they are used on, you are not missing any curly braces, and so on. The W3C has a CSS Validator available too, for this purpose.
Linters
Another good option to choose is a so-called Linter application, which not only points out errors, but can also flag up warnings about bad practices in your CSS, and other points besides. Linters can generally be customized to be stricter or more relaxed in their error/warning reporting.
There are many online linter applications, such as Dirty Markup for HTML, CSS, and JavaScript. These allows you to paste your code into a window, and it will flag up any errors with crosses, which can then be hovered to get an error message informing you what the problem is. Dirty Markup also allows you to make fixes to your markup using the Clean button.

However, it is not very convenient to have to copy and paste your code over to a web page to check its validity several times. What you really want is a linter that will fit into your standard workflow with the minimum of hassle.
Many code editors have linter plugins. For example, see:
SublimeLinter for Sublime Text
Notepad++ linter
VS Code linters
Browser developer tools
The developer tools built into most browsers also feature useful tools for hunting down errors, mainly for CSS.
Note: HTML errors don't tend to show up so easily in dev tools, as the browser will try to correct badly-formed markup automatically; the W3C validator is the best way to find HTML errors — see Validation above.
As an example, in Firefox the CSS inspector will show CSS declarations that aren't applied crossed out, with a warning triangle. Hovering the warning triangle will provide a descriptive error message:

Other browser devtools have similar features.
Common cross browser problems
Now let's move on to look at some of the most common cross browser HTML and CSS problems. The main areas we'll look at are lack of support for modern features, and layout issues.
Browsers not supporting modern features
This is a common problem, especially when you need to support old browsers or you are using features that are implemented in some browsers but not yet in all. In general, most core HTML and CSS functionality (such as basic HTML elements, CSS basic colors and text styling) works across all the browsers you'll want to support; more problems are uncovered when you start wanting to use newer HTML, CSS, and APIs. MDN displays browser compatibility data for each feature documented; for example, see the browser support table for the :has() pseudo-class.
Once you've identified a list of technologies you will be using that are not universally supported, it is a good idea to research what browsers they are supported in, and what related techniques are useful. See Finding help below.
HTML fallback behavior
Some problems can be solved by just taking advantage of the natural way in which HTML/CSS work.
Unrecognized HTML elements are treated by the browser as anonymous inline elements (effectively inline elements with no semantic value, similar to <span> elements). You can still refer to them by their names, and style them with CSS, for example — you just need to make sure they are behaving as you want them to. Style them just as you would any other element, including setting the display property to something other than inline if needed.
More complex elements like HTML <video>, <audio>, <picture>, <object>, and <canvas> (and other features besides) have natural mechanisms for fallbacks to be added in case the resources linked to are not supported. You can add fallback content in between the opening and closing tags, and non-supporting browsers will effectively ignore the outer element and run the nested content.
For example:
html
Copy to Clipboard
<video id="video" controls preload="metadata" poster="img/poster.jpg">
  <source
    src="video/tears-of-steel-battle-clip-medium.webm"
    type="video/webm" />
  <!-- Offer download -->
  <p>
    Your browser does not support WebM video; here is a link to
    <a href="video/tears-of-steel-battle-clip-medium.mp4"
      >view the video directly</a
    >
  </p>
</video>

This example includes a simple link allowing you to download the video if even the HTML video player doesn't work, so at least the user can still access the video.
Another example is form elements. When new <input> types were introduced for inputting specific information into forms, such as times, dates, colors, numbers, etc., if a browser didn't support the new feature, the browser used the default of type="text". Input types were added, which are very useful, particularly on mobile platforms, where providing a pain-free way of entering data is very important for the user experience. Platforms provide different UI widgets depending on the input type, such as a calendar widget for entering dates. Should a browser not support an input type, the user can still enter the required data.
The following example shows date and time inputs:
html
Copy to Clipboard
<form>
  <div>
    <label for="date">Enter a date:</label>
    <input id="date" type="date" />
  </div>
  <div>
    <label for="time">Enter a time:</label>
    <input id="time" type="time" />
  </div>
</form>

The output of this code is as follows:
Note: You can also see this running live as forms-test.html on GitHub (see the source code also).
If you view the example, you'll see the UI features in action as you try to input data. On devices with dynamic keyboards, type-specific keypads will be displayed. On a non-supporting browser, the inputs will just default to normal text inputs, meaning the user can still enter the correct information.
CSS fallback behavior
CSS is arguably better at fallbacks than HTML. If a browser encounters a declaration or rule it doesn't understand, it just skips it completely without applying it or throwing an error. This might be frustrating for you and your users if such a mistake slips through to production code, but at least it means the whole site doesn't come crashing down because of one error, and if used cleverly you can use it to your advantage.
Let's look at an example — a simple box styled with CSS, which has some styling provided by various CSS features:

Note: You can also see this example running live on GitHub as button-with-fallback.html (also see the source code).
The button has a number of declarations that style, but the two we are most interested in are as follows:
css
Copy to Clipboard
button {
  /* … */

  background-color: #ff0000;
  background-color: rgb(255 0 0 / 100%);
  box-shadow:
    inset 1px 1px 3px rgb(255 255 255 / 40%),
    inset -1px -1px 3px rgb(0 0 0 / 40%);
}

button:hover {
  background-color: rgb(255 0 0 / 50%);
}

button:active {
  box-shadow:
    inset 1px 1px 3px rgb(0 0 0 / 40%),
    inset -1px -1px 3px rgb(255 255 255 / 40%);
}

Here we are providing an RGB background-color that changes opacity on hover to give the user a hint that the button is interactive, and some semi-transparent inset box-shadow shades to give the button a bit of texture and depth. While now fully supported, RGB colors and box shadows haven't been around forever; starting in IE9. Browsers that didn't support RGB colors would ignore the declaration meaning in old browsers the background just wouldn't show up at all so the text would be unreadable, no good at all!

To sort this out, we have added a second background-color declaration, which just specifies a hex color — this is supported way back in really old browsers, and acts as a fallback if the modern shiny features don't work. What happens is a browser visiting this page first applies the first background-color value; when it gets to the second background-color declaration, it will override the initial value with this value if it supports RGB colors. If not, it will just ignore the entire declaration and move on.
Note: The same is true for other CSS features like media queries, @font-face and @supports blocks — if they are not supported, the browser just ignores them.
Selector support
Of course, no CSS features will apply at all if you don't use the right selectors to select the element you want to style!
In a comma-separated list of selectors, if you just write a selector incorrectly, it may not match any element. If, however, a selector is invalid, the entire list of selectors is ignored, along with the entire style block. For this reason, only include a :-moz- prefixed pseudo class or pseudo-element in a forgiving selector list, such as :where(::-moz-thumb). Don't include a :-moz- prefixed pseudo class or pseudo-element within a comma-separated group of selectors outside of a :is() or :where() forgiving selector list as all browsers other than Firefox will ignore the entire block. Note that both :is() and :where() can be passed as parameters in other selector lists, including :has() and :not().
We find that it is helpful to inspect the element you are trying to style using your browser's dev tools, then look at the DOM tree breadcrumb trail that DOM inspectors tend to provide to see if your selector makes sense compared to it.
For example, in the Firefox dev tools, you get this kind of output at the bottom of the DOM inspector:

If for example you were trying to use this selector, you'd be able to see that it wouldn't select the input element as desired:
css
Copy to Clipboard
form > #date {
  /* … */
}

(The date form input isn't a direct child of the <form>; you'd be better off using a general descendant selector instead of a child selector).
Handling CSS prefixes
Another set of problems comes with CSS prefixes — these are a mechanism originally used to allow browser vendors to implement their own version of a CSS (or JavaScript) feature while the technology is in an experimental state, so they can play with it and get it right without conflicting with other browser's implementations, or the final unprefixed implementations.
For example, Firefox uses -moz- and Chrome/Edge/Opera/Safari use -webkit-. Other prefixes you may encounter in old code that can safely be removed include -ms-, which was used by Internet Explorer and early versions of Edge, and -o which was used in the original versions of Opera.
Prefixed features were never supposed to be used in production websites — they are subject to change or removal without warning, may cause performance issues in old browser versions that require them, and have been the cause of cross-browser issues. This is particularly a problem, for example, when developers decide to use only the -webkit- version of a property, which implied that the site won't work in other browsers. This actually happened so much that other browser vendors implemented -webkit- prefixed versions of several CSS properties. While browsers still support some prefixed property names, property values, and pseudo classes, now experimental features are put behind flags so that web developers can test them during development.
If using a prefix, make sure it is needed; that the property is one of the few remaining prefixed features. You can look up what browsers require prefixes on MDN reference pages, and sites like caniuse.com. If you are unsure, you can also find out by doing some testing directly in browsers. Include the standard non-prefixed version after the prefixed style declaration; it will be ignored if not supported and used when supported.
css
Copy to Clipboard
.masked {
  -webkit-mask-image: url(MDN.svg);
  mask-image: url(MDN.svg);
  -webkit-mask-size: 50%;
  mask-size: 50%;
}

Try this simple example:
Use this page, or another site that has a prominent heading or other block-level element.
Right/Cmd + click on the element in question and choose Inspect/Inspect element (or whatever the option is in your browser) — this should open up the dev tools in your browser, with the element highlighted in the DOM inspector.
Look for a feature you can use to select that element. For example, at the time of writing, this page on MDN has a logo with an ID of mdn-docs-logo.
Store a reference to this element in a variable, for example:
js
Copy to Clipboard
const test = document.getElementById("mdn-docs-logo");


Now try to set a new value for the CSS property you are interested in on that element; you can do this using the style property of the element, for example try typing these into the JavaScript console:
js
Copy to Clipboard
test.style.transform = "rotate(90deg)";


As you start to type the property name representation after the second dot (note that in JavaScript, CSS property names are written in lower camel case, not kebab-case), the JavaScript console should begin to autocomplete the names of the properties that exist in the browser and match what you've written so far. This is useful for finding out what properties are implemented in that browser.
If you do need to include modern features, test for feature support using @supports, which allows you to implement native feature detection tests, and nest the prefixed or new feature within the @supports block.
Responsive design problems
Responsive design is the practice of creating web layouts that change to suit different device form factors — for example, different screen widths, orientations (portrait or landscape), or resolutions. A desktop layout for example will look terrible when viewed on a mobile device, so you need to provide a suitable mobile layout using media queries, and make sure it is applied correctly using viewport. You can find a detailed account of such practices in our responsive design tutorial.
Resolution is a big issue too — for example, mobile devices are less likely to need big heavy images than desktop computers, and are more likely to have slower internet connections and possibly even expensive data plans that make wasted bandwidth more of a problem. In addition, different devices can have a range of different resolutions, meaning that smaller images could appear pixelated. There are a number of techniques that allow you to work around such problems, from media queries to more complex responsive image techniques, including <picture> and the <img> element's srcset and sizes attributes.
Finding help
There are many other issues you'll encounter with HTML and CSS, making knowledge of how to find answers online invaluable.
Among the best sources of support information are the Mozilla Developer Network (that's where you are now!), stackoverflow.com, and caniuse.com.
To use the Mozilla Developer Network (MDN), most people do a search engine search of the technology they are trying to find information on, plus the term "mdn", for example, "mdn HTML video". MDN contains several useful types of content:
Reference material with browser support information for client-side web technologies, e.g., the <video> reference page.
Other supporting reference material, for example our Guide to media types and formats on the web,
Useful tutorials that solve specific problems, for example, Creating a cross-browser video player.
caniuse.com provides support information, along with a few useful external resource links. For example, see https://caniuse.com/#search=video (you just have to enter the feature you are searching for into the text box).
stackoverflow.com (SO) is a forum site where you can ask questions and have fellow developers share their solutions, look up previous posts, and help other developers. You are advised to look and see if there is an answer to your question already, before posting a new question. For example, we searched for "disabling autofocus on HTML dialog" on SO, and very quickly came up with Disable showModal auto-focusing using HTML attributes.
Aside from that, try searching your favorite search engine for an answer to your problem. It is often useful to search for specific error messages if you have them — other developers will be likely to have had the same problems as you.
Summary
Now you should be familiar with the main types of cross browser HTML and CSS problems that you'll meet in web development, and how to go about fixing them.
Implementing feature detection
Previous


Overview: Testing


Next


Feature detection involves working out whether a browser supports a certain block of code, and running different code depending on whether it does (or doesn't), so that the browser can always provide a working experience rather than crashing/erroring in some browsers. This article details how to write your own simple feature detection, how to use a library to speed up implementation, and native features for feature detection such as @supports.
Prerequisites:
Familiarity with the core HTML, CSS, and JavaScript languages; an idea of the high-level principles of cross-browser testing.
Objective:
To understand what the concept of feature detection is, and be able to implement suitable solutions in CSS and JavaScript.


The concept of feature detection
The idea behind feature detection is that you can run a test to determine whether a feature is supported in the current browser, and then conditionally run code to provide an acceptable experience both in browsers that do support the feature, and browsers that don't. If you don't do this, browsers that don't support the features you are using in your code may not display your sites properly or might fail altogether, creating a bad user experience.
Let's recap and look at the example we touched on in our JavaScript debugging and error handling article — the Geolocation API (which exposes available location data for the device the web browser is running on) has the main entry point for its use, a geolocation property available on the global Navigator object. Therefore, you can detect whether the browser supports geolocation or not by using something like the following:
js
Copy to Clipboard
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    // show the location on a map, such as the Google Maps API
  });
} else {
  // Give the user a choice of static maps
}
Before we move on, we'd like to say one thing upfront — don't confuse feature detection with browser sniffing (detecting what specific browser is accessing the site) — this is a terrible practice that should be discouraged at all costs. See Browser detection using the user agent string (UA sniffing) for more details.
Writing your own feature detection tests
In this section, we'll look at implementing your own feature detection tests, in both CSS and JavaScript.
CSS
You can write tests for CSS features by testing for the existence of element.style.property (e.g., paragraph.style.rotate) in JavaScript.
A classic example might be to test for Subgrid support in a browser; for browsers that support the subgrid value for a subgrid value for grid-template-columns and grid-template-rows, we can use subgrid in our layout. For browsers that don't, we could use regular grid that works fine but is not as cool-looking.
Using this as an example, we could include a subgrid stylesheet if the value is supported and a regular grid stylesheet if not. To do so, we could include two stylesheets in the head of our HTML file: one for all the styling, and one that implements the default layout if subgrid is not supported:
html
Copy to Clipboard
<link href="basic-styling.css" rel="stylesheet" />
<link class="conditional" href="grid-layout.css" rel="stylesheet" />
Here, basic-styling.css handles all the styling that we want to give to every browser. We have two additional CSS files, grid-layout.css and subgrid-layout.css, which contain the CSS we want to selectively apply to browsers depending on their support levels.
We use JavaScript to test the support for the subgrid value, then update the href of our conditional stylesheet based on browser support.
We can add a <script></script> to our document, filled with the following JavaScript
js
Copy to Clipboard
const conditional = document.querySelector(".conditional");
if (CSS.supports("grid-template-columns", "subgrid")) {
  conditional.setAttribute("href", "subgrid-layout.css");
}
In our conditional statement, we test to see if the grid-template-columns property supports the subgrid value using CSS.supports().
@supports
CSS has a native feature detection mechanism: the @supports at-rule. This works in a similar manner to media queries except that instead of selectively applying CSS depending on a media feature like a resolution, screen width or aspect ratio, it selectively applies CSS depending on whether a CSS feature is supported, similar to CSS.supports().
For example, we could rewrite our previous example to use @supports:
css
Copy to Clipboard
@supports (grid-template-columns: subgrid) {
  main {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(4, minmax(100px, auto));
  }

  .item {
    display: grid;
    grid-column: 2 / 7;
    grid-row: 2 / 4;
    grid-template-columns: subgrid;
    grid-template-rows: repeat(3, 80px);
  }

  .subitem {
    grid-column: 3 / 6;
    grid-row: 1 / 3;
  }
}
This at-rule block applies the CSS rule within only if the current browser supports the grid-template-columns: subgrid; declaration. For a condition with a value to work, you need to include a complete declaration (not just a property name) and NOT include the semicolon on the end.
@supports also has AND, OR, and NOT logic available — the other block applies the regular grid layout if the subgrid option is not available:
css
Copy to Clipboard
@supports not (grid-template-columns: subgrid) {
  /* rules in here */
}
This is more convenient than the previous example — we can do all of our feature detection in CSS, no JavaScript required, and we can handle all the logic in a single CSS file, cutting down on HTTP requests. For this reason it is the preferred method of determining browser support for CSS features.
JavaScript
We already saw an example of a JavaScript feature detection test earlier on. Generally, such tests are done via one of a few common patterns.
Common patterns for detectable features include:
Members of an object
Check whether a particular method or property (typically an entry point into using the API or other feature you are detecting) exists in its parent Object.
Our earlier example used this pattern to detect Geolocation support by testing the navigator object for a geolocation member:
js
Copy to Clipboard
if ("geolocation" in navigator) {
  // Access navigator.geolocation APIs
}
Properties of an element
Create an element in memory using Document.createElement() and then check if a property exists on it.
This example shows a way of detecting Canvas API support:
js
Copy to Clipboard
function supports_canvas() {
  return !!document.createElement("canvas").getContext;
}

if (supports_canvas()) {
  // Create and draw on canvas elements
}
Note: The double NOT in the above example (!!) is a way to force a return value to become a "proper" boolean value, rather than a Truthy/Falsy value that may skew the results.
Specific return values of a method on an element
Create an element in memory using Document.createElement() and then check if a method exists on it. If it does, check what value it returns.
Retention of assigned property value by an element
Create an element in memory using Document.createElement(), set a property to a specific value, then check to see if the value is retained.
Bear in mind that some features are, however, known to be undetectable. In these cases, you'll need to use a different approach, such as using a polyfill.
matchMedia
We also wanted to mention the Window.matchMedia JavaScript feature at this point too. This is a property that allows you to run media query tests inside JavaScript. It looks like this:
js
Copy to Clipboard
if (window.matchMedia("(width <= 480px)").matches) {
  // run JavaScript in here.
}
As an example, our Snapshot demo makes use of it to selectively apply the Brick JavaScript library and use it to handle the UI layout, but only for the small screen layout (480px wide or less). We first use the media attribute to only apply the Brick CSS to the page if the page width is 480px or less:
html
Copy to Clipboard
<link href="dist/brick.css" rel="stylesheet" media="(width <= 480px)" />
We then use matchMedia() in the JavaScript several times, to only run Brick navigation functions if we are on the small screen layout (in wider screen layouts, everything can be seen at once, so we don't need to navigate between different views).
js
Copy to Clipboard
if (window.matchMedia("(width <= 480px)").matches) {
  deck.shuffleTo(1);
}
Summary
This article covered feature detection in a reasonable amount of detail, going through the main concepts and showing you how to implement your own feature detection tests.
Next up, we'll start looking at automated testing.
Previous





