#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
YELLOW='\033[1;33m'
NC='\033[0m'


echo -e "${YELLOW}======== ${ORANGE}Checking on Python${NC}"
{
  command -v python3 >/dev/null 2>&1 &&
  echo -e ${GREEN}Python 3 is installed

} || {
  echo -e ${RED}[ERROR]${ORANGE}Python 3 is not installed, check https://docs.nantral-platform.fr to see how to install it.
  exit 1;
}
echo -e "${YELLOW}========= ${GREEN}DONE ${YELLOW}========${NC}"

echo -e "${YELLOW}========= ${ORANGE}Installing virtualenv${NC}"
pip install virtualenv
echo -e "${YELLOW}========= ${GREEN}DONE ${YELLOW}========${NC}"

echo -e "${YELLOW}========= ${ORANGE}Creating environment${NC}"
python3 -m virtualenv env
echo -e "${YELLOW}========= ${GREEN}DONE ${YELLOW}=========${NC}"

. env/bin/activate

echo -e "${YELLOW}========= ${ORANGE}Installing requirements${NC}"
pip install -r requirements.txt
echo -e "${YELLOW}========= ${GREEN}DONE ${YELLOW}=========${NC}"

echo -e "${YELLOW}========= ${ORANGE}Initializing database${NC}"
python manage.py migrate
echo -e "${YELLOW}========= ${GREEN}DONE ${YELLOW}=========${NC}"

echo -e "${YELLOW}========= ${ORANGE}Creating environment variables${NC}"
cat ./config/settings/.env.example > ./.env
echo -e "${YELLOW}========= ${GREEN}DONE ${YELLOW}=========${NC}"
