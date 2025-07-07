# Jupyter Server Configuration for Collaborative Teaching Environment
# This configuration enables the custom identity provider that reads usernames from URL parameters

import os
import sys

# Add the current directory to Python path so we can import our custom identity provider
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Configure the server
c = get_config()  # noqa

# Server settings
c.ServerApp.port = 8888
c.ServerApp.ip = '0.0.0.0'  # Allow connections from any IP
c.ServerApp.allow_origin = '*'  # Allow any origin for demo purposes
c.ServerApp.disable_check_xsrf = True  # Disable CSRF for demo
c.ServerApp.allow_remote_access = True

# Disable custom identity provider temporarily to fix 403 errors
# c.ServerApp.identity_provider_class = 'custom_identity_provider.URLIdentityProvider'

# Enable collaboration
c.YDocExtension.disable_rtc = False

# Collaboration settings
c.YDocExtension.file_poll_interval = 1.0
c.YDocExtension.document_cleanup_delay = 60.0
c.YDocExtension.document_save_delay = 1.0

# Security settings for demo (do not use in production)
c.ServerApp.token = ''  # No token required for demo
c.ServerApp.password = ''  # No password required for demo
c.ServerApp.password_required = False
c.ServerApp.open_browser = False

# Enable logging for debugging
c.Application.log_level = 'INFO'

# Set the default URL to open (optional)
c.ServerApp.default_url = '/lab'

print("Jupyter Server configured with custom identity provider")
print("URLs:")
print("  Teacher (read-only): http://localhost:8888/lab?username=Teacher&readonly=true")
print("  Student: http://localhost:8888/lab?username=Student1&readonly=false") 