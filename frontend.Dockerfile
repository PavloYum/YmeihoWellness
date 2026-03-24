FROM nginx:alpine

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static frontend files to Nginx's serving directory
# We are currently in the project root, so we copy HTML, CSS, JS and images
COPY index.html /usr/share/nginx/html/
COPY datenschutz.html /usr/share/nginx/html/
COPY nutzungsbedingungen.html /usr/share/nginx/html/
COPY impressum.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY legal.js /usr/share/nginx/html/
COPY hero.png /usr/share/nginx/html/
COPY specialist.png /usr/share/nginx/html/
COPY service-spine.png /usr/share/nginx/html/
COPY service-scoliosis.png /usr/share/nginx/html/
COPY service-backpain.png /usr/share/nginx/html/
COPY service-osteochondrosis.png /usr/share/nginx/html/
COPY service-rehab.png /usr/share/nginx/html/
COPY service-joints.png /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
