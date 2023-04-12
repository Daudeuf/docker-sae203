#!/bin/bash

# Start the first process
/etc/init.d/mariadb start &
  
# Start the second process
/etc/init.d/apache2 start &
  
# Wait for any process to exit
wait -n
  
# Exit with status of process that exited first
exit $?
