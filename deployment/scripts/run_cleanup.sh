cd ~/nantralPlatform/deployment/scripts
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python3 db_backup.py --cleanup
deactivate
rm -r env