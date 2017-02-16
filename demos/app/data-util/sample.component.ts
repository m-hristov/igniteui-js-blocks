import { Component, Input, ViewChild, OnInit, DoCheck, Injectable } from "@angular/core";
import { DataContainer, DataUtil, DataState, FilteringExpression, FilteringCondition, PagingError,
    FilteringState, SortingExpression, FilteringLogic, SortingDirection, SortingStrategy } from "../../../src/main";
import {StableSortingStrategy} from "../../../src/data-operations/stable-sorting-strategy"
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Http } from '@angular/http';

// service 
/* Example service */
@Injectable()
export class DataService extends BehaviorSubject<DataContainer> {
    private url: string = 'http://services.odata.org/V4/Northwind/Northwind.svc/Categories?$skip=5&$top=5&$count=true';
    
    constructor(private http: Http) {
        super(null);
    }
    public getData(): void {
        this.fetch()
            .subscribe(x => super.next(x));
    }
    private fetch(): Observable<DataContainer> {
        return this.http
            .get(this.url)
            .map(response => response.json())
            .map(function (response) {
                return (<DataContainer>{
                    data: response.value,
                    transformedData: response.value,
                    total: parseInt(response["@odata.count"], 10)
                });
            });
    }
}


const __data = [{
        "id": 1,
        "first_name": "Andrea",
        "last_name": "Baker",
        "email": "abaker0@ezinearticles.com",
        "gender": "Female",
        "ip_address": "254.44.208.58"
      }, {
        "id": 2,
        "first_name": "Anthony",
        "last_name": "Berry",
        "email": "aberry1@yellowbook.com",
        "gender": "Male",
        "ip_address": "107.202.87.181"
      }, {
        "id": 3,
        "first_name": "Harold",
        "last_name": "Brown",
        "email": "hbrown2@flickr.com",
        "gender": "Male",
        "ip_address": "229.127.208.155"
      }, {
        "id": 4,
        "first_name": "Doris",
        "last_name": "Medina",
        "email": "dmedina3@ebay.co.uk",
        "gender": "Female",
        "ip_address": "244.81.3.229"
      }, {
        "id": 5,
        "first_name": "Rachel",
        "last_name": "Andrews",
        "email": "randrews4@yellowpages.com",
        "gender": "Female",
        "ip_address": "190.2.247.218"
      }, {
        "id": 6,
        "first_name": "Walter",
        "last_name": "Butler",
        "email": "wbutler5@furl.net",
        "gender": "Male",
        "ip_address": "5.202.226.43"
      }, {
        "id": 7,
        "first_name": "Phyllis",
        "last_name": "Bryant",
        "email": "pbryant6@google.co.jp",
        "gender": "Female",
        "ip_address": "232.73.118.144"
      }, {
        "id": 8,
        "first_name": "Sharon",
        "last_name": "Gonzales",
        "email": "sgonzales7@latimes.com",
        "gender": "Female",
        "ip_address": "171.239.6.106"
      }, {
        "id": 9,
        "first_name": "Christopher",
        "last_name": "Franklin",
        "email": "cfranklin8@utexas.edu",
        "gender": "Male",
        "ip_address": "61.203.74.221"
      }, {
        "id": 10,
        "first_name": "Larry",
        "last_name": "Henderson",
        "email": "lhenderson9@whitehouse.gov",
        "gender": "Male",
        "ip_address": "106.43.95.56"
      }, {
        "id": 11,
        "first_name": "Christine",
        "last_name": "Moreno",
        "email": "cmorenoa@bloglovin.com",
        "gender": "Female",
        "ip_address": "93.167.0.175"
      }, {
        "id": 12,
        "first_name": "Scott",
        "last_name": "Olson",
        "email": "solsonb@berkeley.edu",
        "gender": "Male",
        "ip_address": "135.95.3.0"
      }, {
        "id": 13,
        "first_name": "Jane",
        "last_name": "Coleman",
        "email": "jcolemanc@mysql.com",
        "gender": "Female",
        "ip_address": "247.245.10.122"
      }, {
        "id": 14,
        "first_name": "Earl",
        "last_name": "Holmes",
        "email": "eholmesd@mit.edu",
        "gender": "Male",
        "ip_address": "3.205.247.43"
      }, {
        "id": 15,
        "first_name": "Bobby",
        "last_name": "Wallace",
        "email": "bwallacee@infoseek.co.jp",
        "gender": "Male",
        "ip_address": "186.130.245.217"
      }, {
        "id": 16,
        "first_name": "Ashley",
        "last_name": "Armstrong",
        "email": "aarmstrongf@woothemes.com",
        "gender": "Female",
        "ip_address": "190.9.114.170"
      }, {
        "id": 17,
        "first_name": "Eugene",
        "last_name": "Armstrong",
        "email": "earmstrongg@umn.edu",
        "gender": "Male",
        "ip_address": "171.54.186.197"
      }, {
        "id": 18,
        "first_name": "Fred",
        "last_name": "Little",
        "email": "flittleh@sina.com.cn",
        "gender": "Male",
        "ip_address": "74.249.180.133"
      }, {
        "id": 19,
        "first_name": "Brian",
        "last_name": "Wells",
        "email": "bwellsi@foxnews.com",
        "gender": "Male",
        "ip_address": "233.75.170.20"
      }, {
        "id": 20,
        "first_name": "Kelly",
        "last_name": "Morgan",
        "email": "kmorganj@sitemeter.com",
        "gender": "Female",
        "ip_address": "213.32.70.94"
      }, {
        "id": 21,
        "first_name": "Wanda",
        "last_name": "Washington",
        "email": "wwashingtonk@wired.com",
        "gender": "Female",
        "ip_address": "137.38.89.93"
      }, {
        "id": 22,
        "first_name": "Douglas",
        "last_name": "Young",
        "email": "dyoungl@webeden.co.uk",
        "gender": "Male",
        "ip_address": "209.176.247.137"
      }, {
        "id": 23,
        "first_name": "Chris",
        "last_name": "Harvey",
        "email": "charveym@wufoo.com",
        "gender": "Male",
        "ip_address": "66.89.128.219"
      }, {
        "id": 24,
        "first_name": "Diana",
        "last_name": "Frazier",
        "email": "dfraziern@webmd.com",
        "gender": "Female",
        "ip_address": "52.10.210.217"
      }, {
        "id": 25,
        "first_name": "Peter",
        "last_name": "Berry",
        "email": "pberryo@tumblr.com",
        "gender": "Male",
        "ip_address": "170.55.240.125"
      }, {
        "id": 26,
        "first_name": "Nicole",
        "last_name": "Powell",
        "email": "npowellp@uiuc.edu",
        "gender": "Female",
        "ip_address": "59.131.53.124"
      }, {
        "id": 27,
        "first_name": "Denise",
        "last_name": "Fisher",
        "email": "dfisherq@umich.edu",
        "gender": "Female",
        "ip_address": "51.31.180.121"
      }, {
        "id": 28,
        "first_name": "Gary",
        "last_name": "Bailey",
        "email": "gbaileyr@cyberchimps.com",
        "gender": "Male",
        "ip_address": "109.217.246.153"
      }, {
        "id": 29,
        "first_name": "Martin",
        "last_name": "Lynch",
        "email": "mlynchs@fastcompany.com",
        "gender": "Male",
        "ip_address": "33.103.247.96"
      }, {
        "id": 30,
        "first_name": "Sharon",
        "last_name": "Morris",
        "email": "smorrist@wikimedia.org",
        "gender": "Female",
        "ip_address": "43.62.251.36"
      }, {
        "id": 31,
        "first_name": "Donald",
        "last_name": "Perkins",
        "email": "dperkinsu@ehow.com",
        "gender": "Male",
        "ip_address": "223.164.126.13"
      }, {
        "id": 32,
        "first_name": "Heather",
        "last_name": "Kelley",
        "email": "hkelleyv@archive.org",
        "gender": "Female",
        "ip_address": "83.116.127.183"
      }, {
        "id": 33,
        "first_name": "Jane",
        "last_name": "Dunn",
        "email": "jdunnw@home.pl",
        "gender": "Female",
        "ip_address": "85.215.73.242"
      }, {
        "id": 34,
        "first_name": "Kenneth",
        "last_name": "Perry",
        "email": "kperryx@latimes.com",
        "gender": "Male",
        "ip_address": "55.197.212.171"
      }, {
        "id": 35,
        "first_name": "Rebecca",
        "last_name": "Wallace",
        "email": "rwallacey@tinypic.com",
        "gender": "Female",
        "ip_address": "170.79.61.89"
      }, {
        "id": 36,
        "first_name": "Jack",
        "last_name": "Meyer",
        "email": "jmeyerz@japanpost.jp",
        "gender": "Male",
        "ip_address": "191.18.146.163"
      }, {
        "id": 37,
        "first_name": "Matthew",
        "last_name": "Thomas",
        "email": "mthomas10@privacy.gov.au",
        "gender": "Male",
        "ip_address": "26.155.60.48"
      }, {
        "id": 38,
        "first_name": "Ernest",
        "last_name": "Jacobs",
        "email": "ejacobs11@seattletimes.com",
        "gender": "Male",
        "ip_address": "125.220.12.122"
      }, {
        "id": 39,
        "first_name": "Emily",
        "last_name": "Carpenter",
        "email": "ecarpenter12@ca.gov",
        "gender": "Female",
        "ip_address": "171.23.217.20"
      }, {
        "id": 40,
        "first_name": "Brian",
        "last_name": "Gutierrez",
        "email": "bgutierrez13@tmall.com",
        "gender": "Male",
        "ip_address": "57.190.174.189"
      }, {
        "id": 41,
        "first_name": "Ronald",
        "last_name": "Chapman",
        "email": "rchapman14@shinystat.com",
        "gender": "Male",
        "ip_address": "5.165.208.58"
      }, {
        "id": 42,
        "first_name": "Katherine",
        "last_name": "Rogers",
        "email": "krogers15@answers.com",
        "gender": "Female",
        "ip_address": "156.159.174.180"
      }, {
        "id": 43,
        "first_name": "Timothy",
        "last_name": "Alvarez",
        "email": "talvarez16@nyu.edu",
        "gender": "Male",
        "ip_address": "3.229.42.185"
      }, {
        "id": 44,
        "first_name": "Nicole",
        "last_name": "Robertson",
        "email": "nrobertson17@patch.com",
        "gender": "Female",
        "ip_address": "90.74.191.90"
      }, {
        "id": 45,
        "first_name": "Steven",
        "last_name": "Jordan",
        "email": "sjordan18@upenn.edu",
        "gender": "Male",
        "ip_address": "35.24.253.77"
      }, {
        "id": 46,
        "first_name": "Brian",
        "last_name": "Arnold",
        "email": "barnold19@dagondesign.com",
        "gender": "Male",
        "ip_address": "138.212.48.169"
      }, {
        "id": 47,
        "first_name": "Debra",
        "last_name": "Russell",
        "email": "drussell1a@hhs.gov",
        "gender": "Female",
        "ip_address": "77.217.64.165"
      }, {
        "id": 48,
        "first_name": "Betty",
        "last_name": "Bell",
        "email": "bbell1b@devhub.com",
        "gender": "Female",
        "ip_address": "171.28.246.150"
      }, {
        "id": 49,
        "first_name": "Brian",
        "last_name": "Russell",
        "email": "brussell1c@sciencedaily.com",
        "gender": "Male",
        "ip_address": "252.56.5.180"
      }, {
        "id": 50,
        "first_name": "Cheryl",
        "last_name": "Harrison",
        "email": "charrison1d@senate.gov",
        "gender": "Female",
        "ip_address": "138.9.205.83"
      }, {
        "id": 51,
        "first_name": "Mary",
        "last_name": "Burton",
        "email": "mburton1e@time.com",
        "gender": "Female",
        "ip_address": "149.38.186.204"
      }, {
        "id": 52,
        "first_name": "Ruby",
        "last_name": "Washington",
        "email": "rwashington1f@globo.com",
        "gender": "Female",
        "ip_address": "195.236.28.100"
      }, {
        "id": 53,
        "first_name": "James",
        "last_name": "Hayes",
        "email": "jhayes1g@dagondesign.com",
        "gender": "Male",
        "ip_address": "84.233.111.32"
      }, {
        "id": 54,
        "first_name": "Michelle",
        "last_name": "Medina",
        "email": "mmedina1h@tamu.edu",
        "gender": "Female",
        "ip_address": "142.86.72.83"
      }, {
        "id": 55,
        "first_name": "Peter",
        "last_name": "Boyd",
        "email": "pboyd1i@ftc.gov",
        "gender": "Male",
        "ip_address": "55.22.28.229"
      }, {
        "id": 56,
        "first_name": "Ernest",
        "last_name": "Moore",
        "email": "emoore1j@loc.gov",
        "gender": "Male",
        "ip_address": "124.180.172.196"
      }, {
        "id": 57,
        "first_name": "Robert",
        "last_name": "Mccoy",
        "email": "rmccoy1k@alibaba.com",
        "gender": "Male",
        "ip_address": "152.0.131.250"
      }, {
        "id": 58,
        "first_name": "Donna",
        "last_name": "Ferguson",
        "email": "dferguson1l@soundcloud.com",
        "gender": "Female",
        "ip_address": "88.62.210.164"
      }, {
        "id": 59,
        "first_name": "Ronald",
        "last_name": "Martinez",
        "email": "rmartinez1m@nbcnews.com",
        "gender": "Male",
        "ip_address": "107.32.140.157"
      }, {
        "id": 60,
        "first_name": "Barbara",
        "last_name": "Garcia",
        "email": "bgarcia1n@arizona.edu",
        "gender": "Female",
        "ip_address": "90.143.110.225"
      }, {
        "id": 61,
        "first_name": "Debra",
        "last_name": "Watson",
        "email": "dwatson1o@seesaa.net",
        "gender": "Female",
        "ip_address": "190.81.140.250"
      }, {
        "id": 62,
        "first_name": "Mary",
        "last_name": "Morris",
        "email": "mmorris1p@adobe.com",
        "gender": "Female",
        "ip_address": "106.169.246.98"
      }, {
        "id": 63,
        "first_name": "Jonathan",
        "last_name": "Elliott",
        "email": "jelliott1q@prweb.com",
        "gender": "Male",
        "ip_address": "145.91.242.31"
      }, {
        "id": 64,
        "first_name": "Mark",
        "last_name": "Anderson",
        "email": "manderson1r@discovery.com",
        "gender": "Male",
        "ip_address": "112.39.197.5"
      }, {
        "id": 65,
        "first_name": "Kathy",
        "last_name": "Simpson",
        "email": "ksimpson1s@skype.com",
        "gender": "Female",
        "ip_address": "0.150.240.180"
      }, {
        "id": 66,
        "first_name": "Steve",
        "last_name": "Ellis",
        "email": "sellis1t@google.com.br",
        "gender": "Male",
        "ip_address": "43.39.198.137"
      }, {
        "id": 67,
        "first_name": "Joseph",
        "last_name": "Holmes",
        "email": "jholmes1u@phoca.cz",
        "gender": "Male",
        "ip_address": "94.22.79.193"
      }, {
        "id": 68,
        "first_name": "James",
        "last_name": "Russell",
        "email": "jrussell1v@google.com.hk",
        "gender": "Male",
        "ip_address": "161.87.5.90"
      }, {
        "id": 69,
        "first_name": "Wayne",
        "last_name": "Taylor",
        "email": "wtaylor1w@wp.com",
        "gender": "Male",
        "ip_address": "165.114.165.66"
      }, {
        "id": 70,
        "first_name": "Ralph",
        "last_name": "Tucker",
        "email": "rtucker1x@google.it",
        "gender": "Male",
        "ip_address": "254.152.148.249"
      }, {
        "id": 71,
        "first_name": "Brian",
        "last_name": "Anderson",
        "email": "banderson1y@free.fr",
        "gender": "Male",
        "ip_address": "45.83.195.241"
      }, {
        "id": 72,
        "first_name": "Jessica",
        "last_name": "Cook",
        "email": "jcook1z@salon.com",
        "gender": "Female",
        "ip_address": "250.237.211.130"
      }, {
        "id": 73,
        "first_name": "Roy",
        "last_name": "Garrett",
        "email": "rgarrett20@ifeng.com",
        "gender": "Male",
        "ip_address": "137.223.92.242"
      }, {
        "id": 74,
        "first_name": "Deborah",
        "last_name": "Roberts",
        "email": "droberts21@go.com",
        "gender": "Female",
        "ip_address": "243.200.245.69"
      }, {
        "id": 75,
        "first_name": "Donald",
        "last_name": "Hayes",
        "email": "dhayes22@wunderground.com",
        "gender": "Male",
        "ip_address": "62.193.167.41"
      }, {
        "id": 76,
        "first_name": "Adam",
        "last_name": "Hamilton",
        "email": "ahamilton23@canalblog.com",
        "gender": "Male",
        "ip_address": "154.78.9.75"
      }, {
        "id": 77,
        "first_name": "Joe",
        "last_name": "Brooks",
        "email": "jbrooks24@sina.com.cn",
        "gender": "Male",
        "ip_address": "85.236.142.231"
      }, {
        "id": 78,
        "first_name": "Carolyn",
        "last_name": "Fernandez",
        "email": "cfernandez25@buzzfeed.com",
        "gender": "Female",
        "ip_address": "4.201.50.1"
      }, {
        "id": 79,
        "first_name": "Joshua",
        "last_name": "Price",
        "email": "jprice26@drupal.org",
        "gender": "Male",
        "ip_address": "239.193.162.212"
      }, {
        "id": 80,
        "first_name": "Gloria",
        "last_name": "Thomas",
        "email": "gthomas27@jigsy.com",
        "gender": "Female",
        "ip_address": "65.133.218.60"
      }, {
        "id": 81,
        "first_name": "Ralph",
        "last_name": "Richardson",
        "email": "rrichardson28@aboutads.info",
        "gender": "Male",
        "ip_address": "241.118.80.108"
      }, {
        "id": 82,
        "first_name": "Timothy",
        "last_name": "Riley",
        "email": "triley29@instagram.com",
        "gender": "Male",
        "ip_address": "128.211.22.105"
      }, {
        "id": 83,
        "first_name": "Johnny",
        "last_name": "Morales",
        "email": "jmorales2a@furl.net",
        "gender": "Male",
        "ip_address": "124.41.112.23"
      }, {
        "id": 84,
        "first_name": "Gary",
        "last_name": "Reed",
        "email": "greed2b@altervista.org",
        "gender": "Male",
        "ip_address": "105.101.160.30"
      }, {
        "id": 85,
        "first_name": "Amanda",
        "last_name": "Hunter",
        "email": "ahunter2c@soundcloud.com",
        "gender": "Female",
        "ip_address": "8.39.157.217"
      }, {
        "id": 86,
        "first_name": "Anna",
        "last_name": "Nichols",
        "email": "anichols2d@wikia.com",
        "gender": "Female",
        "ip_address": "192.92.153.234"
      }, {
        "id": 87,
        "first_name": "Debra",
        "last_name": "Marshall",
        "email": "dmarshall2e@t.co",
        "gender": "Female",
        "ip_address": "164.245.42.82"
      }, {
        "id": 88,
        "first_name": "Michelle",
        "last_name": "Snyder",
        "email": "msnyder2f@w3.org",
        "gender": "Female",
        "ip_address": "171.55.9.162"
      }, {
        "id": 89,
        "first_name": "Russell",
        "last_name": "Sullivan",
        "email": "rsullivan2g@so-net.ne.jp",
        "gender": "Male",
        "ip_address": "76.111.26.226"
      }, {
        "id": 90,
        "first_name": "Robert",
        "last_name": "Tucker",
        "email": "rtucker2h@sitemeter.com",
        "gender": "Male",
        "ip_address": "202.0.89.52"
      }, {
        "id": 91,
        "first_name": "Carlos",
        "last_name": "Baker",
        "email": "cbaker2i@who.int",
        "gender": "Male",
        "ip_address": "45.235.217.237"
      }, {
        "id": 92,
        "first_name": "James",
        "last_name": "Sims",
        "email": "jsims2j@nymag.com",
        "gender": "Male",
        "ip_address": "170.8.54.97"
      }, {
        "id": 93,
        "first_name": "Tina",
        "last_name": "Fox",
        "email": "tfox2k@yahoo.co.jp",
        "gender": "Female",
        "ip_address": "249.14.194.17"
      }, {
        "id": 94,
        "first_name": "Andrew",
        "last_name": "Dixon",
        "email": "adixon2l@springer.com",
        "gender": "Male",
        "ip_address": "192.159.163.36"
      }, {
        "id": 95,
        "first_name": "Diana",
        "last_name": "Kelley",
        "email": "dkelley2m@loc.gov",
        "gender": "Female",
        "ip_address": "23.59.160.134"
      }, {
        "id": 96,
        "first_name": "Wanda",
        "last_name": "Baker",
        "email": "wbaker2n@dailymail.co.uk",
        "gender": "Female",
        "ip_address": "149.121.91.91"
      }, {
        "id": 97,
        "first_name": "Timothy",
        "last_name": "Powell",
        "email": "tpowell2o@discuz.net",
        "gender": "Male",
        "ip_address": "25.193.225.218"
      }, {
        "id": 98,
        "first_name": "Karen",
        "last_name": "James",
        "email": "kjames2p@census.gov",
        "gender": "Female",
        "ip_address": "198.162.38.226"
      }, {
        "id": 99,
        "first_name": "Bruce",
        "last_name": "King",
        "email": "bking2q@sitemeter.com",
        "gender": "Male",
        "ip_address": "88.254.19.165"
      }, {
        "id": 100,
        "first_name": "Harry",
        "last_name": "Duncan",
        "email": "hduncan2r@mac.com",
        "gender": "Male",
        "ip_address": "112.68.220.51"
      }];

const __data2 = [{
        "id": 18,
        "first_name": "Fred",
        "last_name": "Little",
        "email": "flittleh@sina.com.cn",
        "gender": "Male",
        "ip_address": "74.249.180.133"
      }, {
        "id": 19,
        "first_name": "Brian",
        "last_name": "Wells",
        "email": "bwellsi@foxnews.com",
        "gender": "Male",
        "ip_address": "233.75.170.20"
      }, {
        "id": 20,
        "first_name": "Kelly",
        "last_name": "Morgan",
        "email": "kmorganj@sitemeter.com",
        "gender": "Female",
        "ip_address": "213.32.70.94"
      }, {
        "id": 21,
        "first_name": "Wanda",
        "last_name": "Washington",
        "email": "wwashingtonk@wired.com",
        "gender": "Female",
        "ip_address": "137.38.89.93"
      }, {
        "id": 61,
        "first_name": "Debra",
        "last_name": "Watson",
        "email": "dwatson1o@seesaa.net",
        "gender": "Female",
        "ip_address": "190.81.140.250"
      }, {
        "id": 62,
        "first_name": "Mary",
        "last_name": "Morris",
        "email": "mmorris1p@adobe.com",
        "gender": "Female",
        "ip_address": "106.169.246.98"
      }, {
        "id": 63,
        "first_name": "Jonathan",
        "last_name": "Elliott",
        "email": "jelliott1q@prweb.com",
        "gender": "Male",
        "ip_address": "145.91.242.31"
      }, {
        "id": 64,
        "first_name": "Mark",
        "last_name": "Anderson",
        "email": "manderson1r@discovery.com",
        "gender": "Male",
        "ip_address": "112.39.197.5"
      }, {
        "id": 65,
        "first_name": "Kathy",
        "last_name": "Simpson",
        "email": "ksimpson1s@skype.com",
        "gender": "Female",
        "ip_address": "0.150.240.180"
      }, {
        "id": 66,
        "first_name": "Steve",
        "last_name": "Ellis",
        "email": "sellis1t@google.com.br",
        "gender": "Male",
        "ip_address": "43.39.198.137"
      }, {
        "id": 67,
        "first_name": "Joseph",
        "last_name": "Holmes",
        "email": "jholmes1u@phoca.cz",
        "gender": "Male",
        "ip_address": "94.22.79.193"
      }, {
        "id": 68,
        "first_name": "James",
        "last_name": "Russell",
        "email": "jrussell1v@google.com.hk",
        "gender": "Male",
        "ip_address": "161.87.5.90"
      }, {
        "id": 69,
        "first_name": "Wayne",
        "last_name": "Taylor",
        "email": "wtaylor1w@wp.com",
        "gender": "Male",
        "ip_address": "165.114.165.66"
      },{
        "id": 90,
        "first_name": "Robert",
        "last_name": "Tucker",
        "email": "rtucker2h@sitemeter.com",
        "gender": "Male",
        "ip_address": "202.0.89.52"
      }, {
        "id": 91,
        "first_name": "Carlos",
        "last_name": "Baker",
        "email": "cbaker2i@who.int",
        "gender": "Male",
        "ip_address": "45.235.217.237"
      }, {
        "id": 92,
        "first_name": "James",
        "last_name": "Sims",
        "email": "jsims2j@nymag.com",
        "gender": "Male",
        "ip_address": "170.8.54.97"
      }, {
        "id": 93,
        "first_name": "Tina",
        "last_name": "Fox",
        "email": "tfox2k@yahoo.co.jp",
        "gender": "Female",
        "ip_address": "249.14.194.17"
      }, {
        "id": 94,
        "first_name": "Andrew",
        "last_name": "Dixon",
        "email": "adixon2l@springer.com",
        "gender": "Male",
        "ip_address": "192.159.163.36"
      }, {
        "id": 95,
        "first_name": "Diana",
        "last_name": "Kelley",
        "email": "dkelley2m@loc.gov",
        "gender": "Female",
        "ip_address": "23.59.160.134"
      }, {
        "id": 96,
        "first_name": "Wanda",
        "last_name": "Baker",
        "email": "wbaker2n@dailymail.co.uk",
        "gender": "Female",
        "ip_address": "149.121.91.91"
      }];








@Component({
    selector: "data-iterator",
    moduleId: module.id,
    template: `
    <style>
        .my-table {
            border-spacing: 2px;
            border-collapse: collapse;
        }
        .my-table td, th {
            padding: 5px;
            border: solid 1px gray;
        }
    </style>
    <table class="my-table">
        <thead>
            <tr>
                <th *ngFor="let key of keys">
                    {{key}}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr *ngFor="let dataRow of dataContainer? dataContainer.transformedData : (data || [])" >
                <td *ngFor="let key of keys">
                    {{dataRow[key]}}
                </td>
            </tr>
        </tbody>
</table>`
})
export class DataIterator {
    @Input() data: Object[] = [];
    @Input() keys: string[] = [];
    @Input() dataContainer: DataContainer;
}

@Component({
    providers: [DataService],
    selector: "data-util-sample",
    moduleId: module.id,
    templateUrl: './sample.component.html'
})
export class DataUtilSampleComponent implements OnInit, DoCheck {
    remoteData: Observable<DataContainer>;
    data: any;
    dataContainer: DataContainer;
    ds2: DataContainer;
    DataContainerSettings;
    private paging = {
        pageSize: 5,
        pageIndex: 0,
        pageInfo: ""
    };
    private filtering = {
        searchVal: "",
        info: "row 1"
    };
    private sorting = {
        key: "col1",
        dir: "desc",
        info: ""
    };
    
    // paging sample vars
    @ViewChild("listRemoteData") listRemoteData: DataIterator;
    @ViewChild("listPagingData") listPagingData: DataIterator;
    @ViewChild("listFilteringData") listFilteringData: DataIterator;
    @ViewChild("listSortingData") listSortingData: DataIterator;
    @ViewChild("list") list: DataIterator;
    @ViewChild("listUpdating") listUpdating: DataIterator;
    constructor(private service:DataService) {
        this.remoteData = service;
    }
    ngOnInit() {
        this.listRemoteData.keys = ["CategoryID", "CategoryName", "Description"];
        this.service.getData();
        
        
        this.data = this.generateData(100000, 5);// generates 10 rows with 5 columns in each row
        this.dataContainer = new DataContainer(this.data.rows, this.data.rows.length);
        this.data.rows[0].number = 10000;
        //this.renderListUpdating();
        //this.renderList();
        this.renderPageData();
        // this.renderFilterData();
        //this.renderSortedData();
    }
    ngDoCheck() {
    }
    getDefaultDSSettings() {
        var settings,
            // filtering expression
            fe = <FilteringExpression> {
                                        condition: FilteringCondition.number.greaterThan,
                                        fieldName: "number",
                                        searchVal: 1
                                    },
            // sorting settings
            se0 = <SortingExpression> {
                                        fieldName: "number",
                                        dir: SortingDirection.desc
                                    },
            se1 = <SortingExpression> {
                                        fieldName: "bool",
                                        dir: SortingDirection.desc
                                    };
        return {
            filtering: {
                expressions: [fe]
            },
            sorting: {
                expressions: [se1, se0]
            }
        }
    }
    deleteRecord() {
        var ind = this.dataContainer.data.length - 1;
        if (ind >= 0) {
            this.dataContainer.deleteRecordByIndex(ind);
        }
    }
    addRecord() {
        this.dataContainer.addRecord(this.createRecord(this.data.keys, this.data.rows.length));
        this.dataContainer.process();
    }
    renderListUpdating() {
        var ds = this.dataContainer, cols = this.data.keys;
        ds.process();
        this.listUpdating.dataContainer = ds;
        this.listUpdating.keys = cols;
    }
    renderList() {
        var col, cols = [], row = __data[0],
            // filtering expression
            fe = <FilteringExpression> {
                                        condition: FilteringCondition.number.greaterThan,
                                        fieldName: "number",
                                        "searchVal": 1},
            // sorting settings
            se0 = <SortingExpression> {
                                        fieldName: "first_name",
                                        dir: SortingDirection.desc
                                    },
            se1 = <SortingExpression> {
                                        fieldName: "bool",
                                        dir: SortingDirection.desc
                                    };// generates 10 rows with 3 columns in each row;
        this.ds2 = new DataContainer(__data);
        this.ds2.state.sorting = {
            expressions: [se0],
            strategy: new StableSortingStrategy()
        };
        this.ds2.process();

        for (col in row) {
            if (row.hasOwnProperty(col)) {
                cols.push(col);
            }
        }
        this.list.dataContainer = this.ds2;
        this.list.keys = cols;
    }
    reset() {
        this.dataContainer.process();
    }
    rebind() {
        this.dataContainer.process();
    }
    renderPageData() {
        var p = this.paging,
            metadata, error,
            pageIndex = p.pageIndex,
            pageSize = p.pageSize,
            // filtering expression
            fe = <FilteringExpression> {
                                        condition: FilteringCondition.number.greaterThan,
                                        fieldName: "number",
                                        "searchVal": 1},
            // sorting settings
            se0 = <SortingExpression> {
                                        fieldName: "number",
                                        dir: SortingDirection.desc
                                    },
            se1 = <SortingExpression> {
                                        // fieldName: "col2",
                                        dir: SortingDirection.desc
                                    },
            res,
            t = new Date().getTime(),
            keys = this.data.keys;// generates 10 rows with 3 columns in each row;
        var fs:FilteringState = {
            expressions: [fe],
            logic: FilteringLogic.And
        };
        this.dataContainer
            .process({
              filtering: {
                expressions: [fe]
              },
              paging: {
                  index:pageIndex,
                  recordsPerPage: pageSize
              }
            });
        metadata = this.dataContainer.state.paging.metadata;
        error = metadata.error !== PagingError.None;
        p.pageInfo = error ? "Incorrect arguments" : `Page: ${pageIndex + 1} of ${metadata.countPages} page(s) |
                                Total records: ${metadata.countRecords}
                                Time: ${new Date().getTime() - t} ms.`;
        this.listPagingData.dataContainer = this.dataContainer;
        this.listPagingData.keys = keys;
    }
    test () {
        var dv = this.data.rows;
        this.dataContainer.transformedData[0]["number"] = -1000;
        dv = this.dataContainer.transformedData;
        (dv[0] || {})["col2"] = "Teeeest";
    }
    renderFilterData() {
        var t = new Date().getTime(),
            fe: FilteringExpression ={
                                        condition: FilteringCondition.date.after,
                                        fieldName: "date",
                                        "searchVal": this.filtering.searchVal},
            res = DataUtil.filter(this.data.rows, {expressions: [fe], logic: FilteringLogic.And  });
        this.filtering.info = `Time to filter ${new Date().getTime() - t}`;
        this.listFilteringData.data = res;
        this.listFilteringData.keys = this.data.keys;
    }
    renderSortedData() {
        var t = new Date().getTime(),
            se0 = <SortingExpression> {
                                        fieldName: this.sorting.key || "number",
                                        dir: SortingDirection.desc
                                    },
            se1 = <SortingExpression> {
                                        fieldName: "col2",
                                        dir: SortingDirection.desc
                                    };
        this.listSortingData.data = DataUtil.sort(this.data.rows, { expressions: [se0, se1]});
        this.listSortingData.keys = this.data.keys;
        this.sorting.info = `Sorting time: ${new Date().getTime() - t} ms.`;
    }
    generateColumns (countCols?: number) {
        var i, cols = [], predCols = ["date", "bool", "number"];
        if (countCols <= 0) {
            return predCols;
        }
        if (countCols - predCols.length <= 0) {
            return predCols.slice(0, countCols);
        }
        countCols = countCols - predCols.length;
        for (i = 0; i < countCols; i++) {
            cols.push(`col${i}`);
        }
        return cols.concat(predCols);

    }
    createRecord(cols, i) {
        var j, len = cols.length, key, row = {};
        for (j = 0; j < len; j++) {
                key = cols[j];
                if (key === "date") {
                    row[key] = new Date((new Date()).setDate(i));
                } else if (key === "bool") {
                    row[key] = !!(i % 2);
                } else if (key === "number") {
                    row[key] = i;
                } else {
                    row[key] = `row ${i} col ${j}`;
                }
            }
        return row;
    }
    generateData(countRows?: number, countCols?: number) {
        countCols = countCols || 1;
        countRows = countRows || 0;
        var i, j, data = [], row, cols = this.generateColumns(countCols), key;
        for (i = 0; i < countRows; i++) {
            data.push(this.createRecord(cols, i));
        }
        return {
            rows: data,
            keys: cols
        };
    }
}