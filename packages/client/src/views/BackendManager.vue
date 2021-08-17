<template>
  <div class="management-page">

    <h1 class="backend-name">{{backend.local.name}}</h1>

    <div class="admin-table-container">

      <DataTable class="p-datatable-sm table"  @rowSelect="onRowSelect" @rowUnselect="onRowUnselect" @rowSelectAll="onRowSelectAll" @rowUnselectAll="onRowUnselectAll" :rowHover="true" :value="tableData"  v-model:selection="selectedUsers" :scrollable="true" scrollHeight="70vh">

        <template #header>

          <div class="p-datatable-header"> Users</div>

        </template>

        <Column selectionMode="multiple" headerStyle="width: 1em"></Column>
        <Column field="first_name" header="Name"></Column>
        <Column field="last_name" header="Last Name"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="permission" header="Permissions"></Column>
        <Column field="regStatus" header="Registration Status"></Column>
        <Column field="loggedIn" header="Logged In"></Column>
        <Column field="regKey" header="Registration Key"></Column>

      </DataTable>

    </div>

    <div class="backend-toolbar-container">
    <Toolbar class="backend-toolbar">
      <template #left>
        <span class="p-buttonset">
        <Button @click="showAddUsers" label="Add User" icon="pi pi-user-plus" class="p-button p-button-success p-mr-2 p-button-custom-med"  />
          <Button :disabled="!isUserSelected" @click="deleteUsers" label="Remove User" icon="pi pi-user-minus" class="p-button-danger p-mr-2  p-button-custom-med"  />
        </span>
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true" />
        <Button :disabled="!isUserSelected" @click="changeUserPermissions" label="Change Permissions" icon="pi pi-sort" class="p-button-info p-mr-2 permissions-button p-button-custom-med"  />
        <Dropdown class="toolbar-dropdown" :disabled="!isUserSelected" v-model="selectedPermissionLevel" :options="permissionOptions" placeholder="Select a Role" />
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true" />
        <span class="p-buttonset">
        <Button :disabled="!isUserSelected" @click="logOutUsers" label="Logout" icon="pi pi-lock" class="p-button-warning p-button-custom-med" />
          <Button :disabled="!isUserSelected" @click="revokeUserKeys" label="Revoke Keys" icon="pi pi-ban" class="p-button-danger p-button-custom-med" />
        </span>
          <i class="pi pi-pause p-toolbar-separator p-mr-2" aria-hidden="true"/>
        <Button :disabled="!isUserSelected" @click="copyUsers" label="Copy" icon="pi pi-copy" class="p-button-info p-button-custom-med" />

      </template>
      </Toolbar>

      <Dialog header="Add User" v-model:visible="showAddUserDialog" :style="{width: '35em'}" :position="addUserPos" :modal="true" dismissable-mask=true>

        <div style="display: flex; flex-direction: column;">

        <div class="p-field p-grid" style="margin-top: 0.8em; margin-left:0.8em; display: flex">

          <div class="p-field p-col-12 p-md-4" >
            <span class="p-float-label">
                        <InputText id="input-firstname" type="text" v-model="addUserFirstName"  />
                        <label for="input-firstname">First Name</label>
                    </span>
          </div>

          <div class="p-field p-col-12 p-md-4" style="margin-left: 2em">
            <span class="p-float-label">
                        <InputText id="input-lastname" type="text" v-model="addUserLastName"  />
                        <label for="input-lastname">Last Name</label>
                    </span>
          </div>

        </div>
        <div class="p-field p-grid" style="margin-top: 0.8em; margin-left:0.8em">

          <div class="p-field p-col-12 p-md-4" >
            <span class="p-float-label">
                        <InputText id="input-email" type="text" v-model="addUserEmail"  />
                        <label for="input-email">Email</label>
                    </span>
          </div>

        </div>
        <div class="p-field p-grid" style="margin-top: 0.8em; margin-left:0.8em">

          <div class="p-field p-col-12 p-md-4" >
            <span class="p-float-label">
                <Dropdown id="input-perm" v-model="addUserPermission" :options="permissionOptions" />
                        <label for="input-perm">Permission</label>
                    </span>
          </div>

        </div>



        </div>

        <template #footer>
          <Button label="Cancel" icon="pi pi-times" @click="hideAddUsers" class="p-button-text" />
          <Button label="Add" icon="pi pi-check" @click="hideAddUsers" autofocus />
        </template>


      </Dialog>

    </div>

    <Toast position="bottom-right"/>

    </div>



</template>

<script>
import {mapGetters} from "vuex";
import axios from "axios";

export default {
  name: "BackendManager.vue",
  data() {
    return {
      backend: null,
      isUserSelected: false,
      selectedUsers: null,
      selectedPermissionLevel : null,

      showAddUserDialog : false,
      addUserPos: "bottomleft",

      addUserFirstName: "",
      addUserLastName: "",
      addUserEmail: "",
      addUserPermission: "",

      //Needs to be determined on page load
      permissionOptions: ['Super', 'Admin', 'Editor', 'Viewer'],

      //Temporarily Hardcoded for Testing
      tableData: [{
        "id": 1,
        "first_name": "Aldis",
        "last_name": "Birley",
        "email": "abirley0@soup.io",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "cef02571-6afb-453f-9705-41ee70086e65"
      }, {
        "id": 2,
        "first_name": "Jeanna",
        "last_name": "Folomkin",
        "email": "jfolomkin1@unicef.org",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "69098ece-3413-4ceb-a23d-0f30f22170d1"
      }, {
        "id": 3,
        "first_name": "Arty",
        "last_name": "Kender",
        "email": "akender2@accuweather.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "ec37455c-73ca-441c-8857-6ed73bf9df04"
      }, {
        "id": 4,
        "first_name": "Nikolaus",
        "last_name": "Ketton",
        "email": "nketton3@utexas.edu",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "d14411a9-0e46-48f5-a50a-568998dd4e1d"
      }, {
        "id": 5,
        "first_name": "Clovis",
        "last_name": "Hoyes",
        "email": "choyes4@state.tx.us",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "ab54272c-06bc-4ff1-b7c2-0fbe52d3cb1f"
      }, {
        "id": 6,
        "first_name": "Kacie",
        "last_name": "Trevena",
        "email": "ktrevena5@arizona.edu",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "9398f8db-dfd6-4cca-85f7-64d395b827ba"
      }, {
        "id": 7,
        "first_name": "Ase",
        "last_name": "Wegenen",
        "email": "awegenen6@home.pl",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "5ff37d01-88eb-4ccb-8fc4-ad2e14729df5"
      }, {
        "id": 8,
        "first_name": "Kris",
        "last_name": "Marrow",
        "email": "kmarrow7@dagondesign.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "2a29843d-6539-4e06-b570-56c141c65f3d"
      }, {
        "id": 9,
        "first_name": "Wilhelm",
        "last_name": "Scouler",
        "email": "wscouler8@pbs.org",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "758c9d6e-4ba3-4f32-8317-f1f8f4cf0857"
      }, {
        "id": 10,
        "first_name": "Moore",
        "last_name": "Le Blond",
        "email": "mleblond9@scientificamerican.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "0aa83329-7398-4515-9242-f6f51cbd80b8"
      }, {
        "id": 11,
        "first_name": "Lutero",
        "last_name": "Fishby",
        "email": "lfishbya@mapy.cz",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "e7a3c706-4df9-4ac4-9bdc-b49e23f6f4c4"
      }, {
        "id": 12,
        "first_name": "Demott",
        "last_name": "Melloi",
        "email": "dmelloib@bloglines.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "776da88d-d3bb-4607-990c-22133f5db81d"
      }, {
        "id": 13,
        "first_name": "Ediva",
        "last_name": "Hubbart",
        "email": "ehubbartc@plala.or.jp",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "016f47ef-fc22-4738-af3c-6d53554c8ea2"
      }, {
        "id": 14,
        "first_name": "Grove",
        "last_name": "Bedell",
        "email": "gbedelld@cnn.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "827ecb89-35dc-490a-b32b-f0225ce63fe8"
      }, {
        "id": 15,
        "first_name": "Adey",
        "last_name": "Boultwood",
        "email": "aboultwoode@bandcamp.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "dbaa4a35-d0d8-4450-aaaf-146b0097d3e3"
      }, {
        "id": 16,
        "first_name": "Berke",
        "last_name": "Benezeit",
        "email": "bbenezeitf@slideshare.net",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "2efad679-cfeb-4ef4-92b1-37c0b584ab33"
      }, {
        "id": 17,
        "first_name": "Alejandrina",
        "last_name": "Scripps",
        "email": "ascrippsg@miitbeian.gov.cn",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "06ce339a-3598-41e0-bf61-eb6325ea16c4"
      }, {
        "id": 18,
        "first_name": "Richy",
        "last_name": "GiacobbiniJacob",
        "email": "rgiacobbinijacobh@squidoo.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "f45d4193-73e0-4357-8f1f-229d30a5411b"
      }, {
        "id": 19,
        "first_name": "Charmine",
        "last_name": "Persitt",
        "email": "cpersitti@simplemachines.org",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "e1c633b7-2de1-4826-bcfe-9fc8c9a93bd2"
      }, {
        "id": 20,
        "first_name": "Ferne",
        "last_name": "Cave",
        "email": "fcavej@mail.ru",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "af0a2655-82d4-404f-95dc-0ac77dc79092"
      }, {
        "id": 21,
        "first_name": "Jacinthe",
        "last_name": "Cranmere",
        "email": "jcranmerek@eventbrite.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "5b64a0f5-56d4-45ae-8fdb-add6f0b27fd9"
      }, {
        "id": 22,
        "first_name": "Henrik",
        "last_name": "Maplethorp",
        "email": "hmaplethorpl@admin.ch",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "bbc88c09-7903-4d3b-a5ad-25ce8ec06600"
      }, {
        "id": 23,
        "first_name": "Lawry",
        "last_name": "Freebury",
        "email": "lfreeburym@admin.ch",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "14ca369c-0a49-4efa-b820-1f3974e1d000"
      }, {
        "id": 24,
        "first_name": "Chaddie",
        "last_name": "Rizziello",
        "email": "crizziellon@un.org",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "3f79eef4-3d5a-41f5-9bf3-f9b1bdfc05a5"
      }, {
        "id": 25,
        "first_name": "Ede",
        "last_name": "Clerk",
        "email": "eclerko@washington.edu",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "531b0556-aa59-4c41-934a-909924df2ddd"
      }, {
        "id": 26,
        "first_name": "Sophie",
        "last_name": "Dedrick",
        "email": "sdedrickp@list-manage.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "867c2c2d-b46e-4dd4-8206-f1d06ac00cc2"
      }, {
        "id": 27,
        "first_name": "Gray",
        "last_name": "Pealing",
        "email": "gpealingq@dyndns.org",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "377eb207-819a-40f3-b0da-e931818ea182"
      }, {
        "id": 28,
        "first_name": "Prue",
        "last_name": "Phillipps",
        "email": "pphillippsr@hugedomains.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "dd60d864-0013-4158-909d-ab280b1e81ec"
      }, {
        "id": 29,
        "first_name": "Rodney",
        "last_name": "Rothwell",
        "email": "rrothwells@elegantthemes.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "ec46ba0c-67ed-40aa-94f0-696eaf36e652"
      }, {
        "id": 30,
        "first_name": "Mabelle",
        "last_name": "Grabban",
        "email": "mgrabbant@cisco.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "c1225811-54fe-4fc4-9a25-9ec72411ce23"
      }, {
        "id": 31,
        "first_name": "Phillida",
        "last_name": "Gange",
        "email": "pgangeu@t-online.de",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "b83684d8-52e7-481c-864a-d4aae3e6f371"
      }, {
        "id": 32,
        "first_name": "Rafaela",
        "last_name": "Readett",
        "email": "rreadettv@cyberchimps.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "97063693-1269-4562-8531-145dea541c09"
      }, {
        "id": 33,
        "first_name": "Opal",
        "last_name": "Camerello",
        "email": "ocamerellow@topsy.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "258cdfbd-2ba3-41ea-b92b-f274d86a5314"
      }, {
        "id": 34,
        "first_name": "Dorolice",
        "last_name": "Bendin",
        "email": "dbendinx@mashable.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "7063692b-87cb-4d99-90af-049e8be34f92"
      }, {
        "id": 35,
        "first_name": "Ann",
        "last_name": "Shorthouse",
        "email": "ashorthousey@1und1.de",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "f07e2f9c-a2a3-45f4-bf03-810d1df83efa"
      }, {
        "id": 36,
        "first_name": "Carlo",
        "last_name": "Seywood",
        "email": "cseywoodz@blogs.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "a306c59c-7757-42c0-a382-16dab7c711aa"
      }, {
        "id": 37,
        "first_name": "Freddy",
        "last_name": "Partleton",
        "email": "fpartleton10@github.io",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "11ce5630-0b88-4338-afc8-64ac4630cf51"
      }, {
        "id": 38,
        "first_name": "Nadya",
        "last_name": "McGall",
        "email": "nmcgall11@macromedia.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "baaffdee-832f-4319-8ca6-d452adbc4ebd"
      }, {
        "id": 39,
        "first_name": "Cleve",
        "last_name": "Petkens",
        "email": "cpetkens12@hatena.ne.jp",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "0951f8dc-d6d1-4b90-bee6-ea81ac023d5e"
      }, {
        "id": 40,
        "first_name": "Sorcha",
        "last_name": "Scutter",
        "email": "sscutter13@usnews.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "596854d5-9919-42df-ac0e-235de79b7ead"
      }, {
        "id": 41,
        "first_name": "Bethany",
        "last_name": "Gimson",
        "email": "bgimson14@yolasite.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "c1b3d074-6cc4-4d9c-a3e2-824e9a12131d"
      }, {
        "id": 42,
        "first_name": "Geno",
        "last_name": "Witts",
        "email": "gwitts15@wisc.edu",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "126e13dc-c6a2-4d85-b3fa-ecca5bc3b458"
      }, {
        "id": 43,
        "first_name": "Mathe",
        "last_name": "Statersfield",
        "email": "mstatersfield16@godaddy.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "a9968d1e-fc9c-493b-ab75-11581b5ab05a"
      }, {
        "id": 44,
        "first_name": "Janina",
        "last_name": "Missenden",
        "email": "jmissenden17@fc2.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "26c24849-1eeb-44bc-9d3f-cb270bc518f5"
      }, {
        "id": 45,
        "first_name": "Alessandro",
        "last_name": "Northcote",
        "email": "anorthcote18@gov.uk",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "e9ac0c80-1fc7-47e7-9084-e5fadeab8f05"
      }, {
        "id": 46,
        "first_name": "Billye",
        "last_name": "Oldland",
        "email": "boldland19@engadget.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "7c1dbc04-72d8-481f-a46b-290f8b199afa"
      }, {
        "id": 47,
        "first_name": "Atalanta",
        "last_name": "Mulcahy",
        "email": "amulcahy1a@nasa.gov",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "b8ff9954-16e0-43d7-93e5-f528ccfea680"
      }, {
        "id": 48,
        "first_name": "Arlan",
        "last_name": "Swatman",
        "email": "aswatman1b@wordpress.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "084f9d2f-c41c-4fd4-b500-2913a5dab294"
      }, {
        "id": 49,
        "first_name": "Nessie",
        "last_name": "McGuckin",
        "email": "nmcguckin1c@wunderground.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "856ea4fa-e91a-45e3-b400-d13ecbdc7d09"
      }, {
        "id": 50,
        "first_name": "Rowena",
        "last_name": "Weeds",
        "email": "rweeds1d@weibo.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "1736e3e3-95c2-45ce-84a0-ff5a1309e973"
      }, {
        "id": 51,
        "first_name": "Camel",
        "last_name": "MacDonogh",
        "email": "cmacdonogh1e@drupal.org",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "632b0e9e-580e-4829-b8f0-5ead68e5bf55"
      }, {
        "id": 52,
        "first_name": "Lance",
        "last_name": "Chesney",
        "email": "lchesney1f@narod.ru",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "a9dec9bd-f3b5-47f3-94a7-a2b6e69a21a9"
      }, {
        "id": 53,
        "first_name": "Dave",
        "last_name": "Nassey",
        "email": "dnassey1g@wordpress.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "da58a858-db01-42cc-a7a7-c93de60a2c05"
      }, {
        "id": 54,
        "first_name": "Sharlene",
        "last_name": "Lye",
        "email": "slye1h@patch.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "669657b1-5425-4832-96fe-91f0b94deaaa"
      }, {
        "id": 55,
        "first_name": "Haily",
        "last_name": "Rickerby",
        "email": "hrickerby1i@g.co",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "df7689c8-3665-4b76-9cf0-d81f3b9a68a5"
      }, {
        "id": 56,
        "first_name": "Gael",
        "last_name": "Pummery",
        "email": "gpummery1j@latimes.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "72a83c36-8aa3-4b37-b9b1-5a48e9d1af09"
      }, {
        "id": 57,
        "first_name": "Lind",
        "last_name": "Scraney",
        "email": "lscraney1k@msn.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "b628624a-a6d7-4528-b35d-49fce4c3523f"
      }, {
        "id": 58,
        "first_name": "Bobbee",
        "last_name": "Paxforde",
        "email": "bpaxforde1l@theguardian.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "07583d27-797f-4c6f-9622-2132f91cbd16"
      }, {
        "id": 59,
        "first_name": "Phil",
        "last_name": "Bedder",
        "email": "pbedder1m@pinterest.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": true,
        "regKey": "05aee5e6-d889-4e25-b302-63b1e010efa3"
      }, {
        "id": 60,
        "first_name": "Kristina",
        "last_name": "Dineges",
        "email": "kdineges1n@marketwatch.com",
        "permission": "Admin",
        "regStatus": "Registered",
        "loggedIn": false,
        "regKey": "cbb72169-c33b-46bf-96fd-bd45d41c36b4"
      }]
    }

  },
  props: {
    backendID : Number,
  },
  computed: {
    ...mapGetters([
      'getUserBackend',
      'getSignedInUserId',
    ])
  },
  methods : {
    addUsers(){

      let config
      let reqObj = {first_name: this.addUserFirstName, last_name: this.addUserLastName, }

      axios.post(this.backend.connect.link + "/admin/addusers", ).then(
          resp => {
            console.log(resp.data);
            this.sources = resp.data.data;
            let i;
            for (i = 0; i < this.sources.length; i++) {
              this.sources[i]["backend"] = "Local"
            }
            this.loading = false
          }
      )

    },
    deleteUsers(){

    },
    changeUserPermissions(){

    },
    revokeUserKeys(){

    },
    logOutUsers(){

    },
    //Copy backend url and user name, email, registration key to clipboard
    copyUsers(){

      let usersString = "";

      for(let userData of this.selectedUsers) {
        usersString += "Backend: " + this.backend.connect.link;
        usersString += " ,Email: " + userData.email;
        usersString += " ,Name: " + userData.first_name + " " + userData.last_name;
        usersString += " ,Registration Key: " + userData.regKey + "\n";

      }

      navigator.clipboard.writeText(usersString);

      this.$toast.add({
        severity: 'success',
        summary: 'Success',
        detail: this.selectedUsers.length + " Users Copied to Clipboard",
        life: 3000});

    },

    //Selection Events
    onRowSelect(){
      console.log("Selected a Row");
      this.isUserSelected = true;
    },
    onRowUnselect(){
      console.log("Unselected a Row");
      if(this.selectedUsers.length === 0){
        this.isUserSelected = false;
      }
    },
    onRowSelectAll(){
      console.log("Selected all Rows");
      this.isUserSelected = true;
    },
    onRowUnselectAll(){
      console.log("Unselected all Rows");
      this.isUserSelected = false;
    },
    showAddUsers(){

      this.showAddUserDialog = true;

    },
    hideAddUsers(){

      this.showAddUserDialog = false;

    }
  },
  beforeMount() {
    //console.log(this.backendID)
    this.backend = this.getUserBackend(this.getSignedInUserId)[this.backendID]
  //  console.log(this.backend.name)
  }
}
</script>

<style scoped>

.management-page {

  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 10fr;
  grid-template-columns: 1fr;


}

.backend-name {
  text-align: center;
  color: #ededed;

  grid-row-start : 1;
}

.backend-toolbar {

  padding: 0.3em

}

.backend-toolbar-container {
  justify-self: center;
  position: sticky;
  bottom: 3vh;
  align-self: center;
  margin: 0 0 2.5em;



}

.operation-button {
  margin-right: 0.16em;
  margin-left: 0.16em
}

.permissions-button {
  margin-right: 0;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;


}


.p-button-custom-med {
  padding: 0.54rem 0.74rem;
  font-size: 1rem;
}

.p-button {
  padding: 0.54rem 0.74rem;
  font-size: 1rem;
}

.table {
  grid-row-start: 2;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.p-datatable-header {

  padding: 0.4rem 0.4rem;

}


::v-deep(.p-inputtext) {

  padding: 0.54rem 0.74rem;
  font-size: 1rem;


}

::v-deep(.p-dropdown){

  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  width: 8em;


}

::v-deep(td){
  overflow: hidden;
}



</style>