from bs4 import BeautifulSoup
from urllib.request import Request, urlopen
import wget

# get anime midi files from Kenzie Smith
# URL: https://kenziesmithpiano.com/anime-midi/


def download_data_from_source_1(url):
    web_data = urlopen(url).read()
    soup = BeautifulSoup(web_data, 'html.parser')

    a_tags = soup.find_all('a', href=True)

    links = []
    link_format = "https://drive.google.com/u/0/uc?id={}&export=download"
    for tag in a_tags:
        link = tag["href"]
        if link.find("drive.google.com") != -1:
            pieces = link.split('/')
            if (pieces[3] != 'file'):
                continue

            file_id = pieces[-2]
            links.append(link_format.format(file_id))

    for link in links:
        wget.download(link, './data')


# get anime midi files from UtaPriForever1(Anime Midi)
# URL: https://utapriforever1.webs.com/
def download_data_from_source_2(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.3"}
    req = Request(url=url, headers=headers)
    web_data = urlopen(req).read()

    soup = BeautifulSoup(web_data, 'html.parser')

    a_tags = soup.find_all('a', href=True)

    links = []
    for tag in a_tags:
        link = tag["href"]
        if link.find(".mid") != -1:
            link = link.replace(' ', '%20')
            links.append(link)

    for link in links:
        req = Request(url=link, headers=headers)
        web_data = urlopen(req)
        fname = link.split('/')[-1]
        fname = fname.replace('%20', ' ')

        with open('./data/{}'.format(fname), 'wb') as f:
            f.write(web_data.read())


if __name__ == "__main__":
    download_data_from_source_1("https://kenziesmithpiano.com/anime-midi/")
    download_data_from_source_2("https://utapriforever1.webs.com/")
