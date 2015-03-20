module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Takes your scss files and compiles them to css
        sass: {
          dist: {
            options: {
              style: 'expanded'
            },
            files: {
              'src/css/main.css': 'src/css/scss/main.scss'
            }
          }
        },

        // Assembles your email content with html layout
        assemble: {
          options: {
            layoutdir: 'src/layouts',
            flatten: true
          },
          pages: {
            src: ['src/emails/*.hbs'],
            dest: 'dist/'
          }
        },

        // Inlines your css
        premailer: {
          simple: {
            options: {
              removeComments: true
            },
            files: [{
                expand: true,
                src: ['dist/*.html'],
                dest: ''
            }]
          }
        },

        // Watches for changes to css or email templates then runs grunt tasks
        watch: {
          files: ['src/css/scss/*','src/emails/*','src/layouts/*'],
          tasks: ['default']
        },

        // Use Mailgun option if you want to email the design to your inbox or to something like Litmus
        mailgun: {
          mailer: {
            options: {
              key: 'xxx', // Enter your Mailgun API key here
              sender: 'ben@exceptional.io', // Change this
              recipient: 'benarent@gmail.com', // Change this
              subject: 'This is a test email'
            },
            src: ['dist/'+grunt.option('template')]
          }
        },

        // Use Rackspace Cloud Files if you're using images in your email
        cloudfiles: {
          prod: {
            'user': 'grunt.files', // Change this
            'key': 'xxx', // Change this
            'region': 'IAD', // Might need to change this
            'upload': [{
              'container': 'grunt-emails', // Change this
              'src': 'src/img/*',
              'dest': '/',
              'stripcomponents': 0
            }]
            , // Might need to change this
            'upload': [{
              'container': 'grunt-emails', // Change this
              'src': 'src/img/gif/*',
              'dest': '/',
              'stripcomponents': 0
            }]
          }
        },

        // CDN will replace local paths with your Cloud CDN path
        cdn: {
          options: {
            cdn: 'http://a810ac3d03c99b1de2e9-c5b953ed91674586b2a3d6fb9a6e0d2c.r0.cf5.rackcdn.com', // Change this
            flatten: true,
            supportedTypes: 'html'
          },
          dist: {
            cwd: './dist/',
            dest: './dist/',
            src: ['*.html']
          }
        }

    });

    // Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-mailgun');
    grunt.loadNpmTasks('grunt-premailer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-cloudfiles');
    grunt.loadNpmTasks('grunt-cdn');

    // Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['sass','assemble','premailer']);

    // Use grunt send if you want to actually send the email to your inbox
    grunt.registerTask('send', ['mailgun']);

    // Upload images to our CDN on Rackspace Cloud Files
    grunt.registerTask('cdnify', ['default','cloudfiles','cdn']);

};
