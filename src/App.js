import './App.css';
import React, { useState, useEffect } from 'react';
import axios from "axios";

 

function App() {
  
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const underlineStyle = {
    textDecoration: isHovered ? 'underline' : 'none',
    fontWeight: 'bold'
  };

  const [cities, setCities] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [zones, setZones] = useState([]);
  

  const [selectedSpeciality, setSelectedSpeciality] = useState('none');

  const handleSpecialityChange = (event) => {
    setSelectedSpeciality(event.target.value);
  };
  const [selectedSerie, setSelectedSerie] = useState('none');

  const handleSerieChange = (event) => {
    setSelectedSerie(event.target.value);
  };  

  useEffect(() => {
    fetch('http://localhost:8080/api/villes/all')
      .then(response => response.json())
      .then(data => setCities(data))
      .catch(error => console.log(error));
  }, []);

  
  useEffect(() => {
    if (selectedCity) {
      fetch(`http://localhost:8080/api/villes/${selectedCity}/zones`)
        .then(response => response.json())
        .then(data => setZones(data))
        .catch(error => console.log(error));
    } else {
      setZones([]);
    }
  }, [selectedCity]);

  const handleCityChange = event => {
    setSelectedCity(event.target.value);
  };

  

  const [isButtonHidden, setIsButtonHidden] = useState(true);
  function handleSelectChange(event) {
  
    if (event.target.value === 'none') {
      
      setIsButtonHidden(true);
    } else {
     
        setSelectedZone(event.target.value);
    
      setIsButtonHidden(false);
    }
  }
  
 

  const [series, setSeries] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8080/api/serie/all')
      .then(response => response.json())
      .then(data => setSeries(data))
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/sepecialite/all')
      .then(response => response.json())
      .then(data => setSpecialites(data))
      .catch(error => console.log(error));
  }, []); 



  useEffect(() => {
    if(selectedSerie==='none' && selectedSpeciality==='none' && selectedCity && selectedZone) {
      const apiUrl = `http://localhost:8080/api/villes/${selectedCity}/zones/${selectedZone}/restaurants`;
      axios.get(apiUrl)
        .then(response => {
          setRestaurants(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    } else if(selectedCity && selectedZone && selectedSpeciality && selectedSerie==='none') {
      const apiUrl = `http://localhost:8080/api/villes/${selectedCity}/zones/${selectedZone}/restaurants/specialite=${selectedSpeciality}`;
      axios.get(apiUrl)
        .then(response => {
          setRestaurants(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    } else if(selectedCity && selectedZone && selectedSerie && selectedSpeciality==='none') {
      const apiUrl = `http://localhost:8080/api/villes/${selectedCity}/zones/${selectedZone}/restaurants/serie=${selectedSerie}`;
      axios.get(apiUrl)
        .then(response => {
          setRestaurants(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    } else if(selectedCity && selectedZone && selectedSpeciality && selectedSerie) {
      const apiUrl = `http://localhost:8080/api/villes/${selectedCity}/zones/${selectedZone}/restaurants/specialite=${selectedSpeciality}/serie=${selectedSerie}`;
      axios.get(apiUrl)
        .then(response => {
          setRestaurants(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      setRestaurants([]);
    }
  }, [selectedCity, selectedZone, selectedSpeciality, selectedSerie]);

  
  
  const [showFirstDiv, setShowFirstDiv] = useState(true);
  const [showSecondDiv, setShowSecondDiv] = useState(false);
  const [showThirdDiv, setShowThirdDiv] = useState(false);
  const [showFourthDiv, setShowFourthDiv] = useState(false);
  
  const handleShowSecondDiv = () => {
    setShowFirstDiv(false);
    setShowSecondDiv(true);
    setShowThirdDiv(false);
    setShowFourthDiv(false);
  };
  
  const handleShowThirdDiv = () => {
    setShowFirstDiv(false);
    setShowSecondDiv(false);
    setShowThirdDiv(true);
    setShowFourthDiv(false);
  };
  
  const handleShowFourthDiv = () => {
    setShowFirstDiv(false);
    setShowSecondDiv(false);
    setShowThirdDiv(false);
    setShowFourthDiv(true);
  };
  


  const send = (latitude, longitude,nom) => {
    const url = `http://127.0.0.1:5500/public/Map.html?lat=${latitude}&log=${longitude}&nom=${nom}`;
    window.open(url, '_blank');
  }



  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showOwner, setShowOwner] = useState(false);


  const handleLogin = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${email}/${password}`);
      setUser(response.data);
      setLoggedIn(true);
      if (response.data.roles.length === 0) {
       setShowOwner(true);
       checkowner(response.data.id);
      } else {
        setShowAdmin(true);
      }

     
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setLoggedIn(false);
    setEmail('')
    setPassword('')
    setShowOwner(false);
    setShowAdmin(false);
  };

  const [citiees, setCitiees] = useState([]);

  const fetchCities = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/villes/all');
      const data = await response.json();
      setCitiees(data);
    } catch (error) {
    
    }
  };

  const deleteCity = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/villes/${id}`, {
        method: 'DELETE',
      });
      fetchCities();
    } catch (error) {
      
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

    const [cityName, setCityName] = useState('');
  
    const handleCityNameChange = (event) => {
      setCityName(event.target.value);
    };
  
    const handleSaveClick = async () => {
      if (cityName.trim() === '' ) {
        alert('Please enter a city name ');
        return;
      }
        try {
       

       
        const response = await fetch('http://localhost:8080/api/villes/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nom:cityName }),
        });
       fetchCities()
        setCityName('');
      } catch (error) {
        
      
    }; }


    const [showMcity, setShowMcity] = useState(true);
    const [showMzone, setShowMzone] = useState(false);
   const [showMserie, setShowMserie] = useState(false); 
   const [showMspacialite, setShowMspacialite] = useState(false);
   
  
   
  
    const handleshowMcity = () => {
      setShowMcity(true);
      setShowMzone(false);
      setShowMserie(false);
      setShowMspacialite(false);
      
      
    };
    const handleshowMzone = () => {
      setShowMcity(false);
      setShowMzone(true);
      setShowMserie(false);
      setShowMspacialite(false);
      
      
    }; 
    const handleshowMserie = () => {
      setShowMcity(false);
      setShowMzone(false);
      setShowMserie(true);
      setShowMspacialite(false);
      
      
    };
    const handleshowMspacialite = () => {
      setShowMcity(false);
      setShowMzone(false);
      setShowMserie(false);
      setShowMspacialite(true);
    
      
    };

  
   
    const [zonees, setZonees] = useState([]);

    useEffect(() => {
      fetchZonees();
    }, []);
  
    const fetchZonees = async () => {
      const response = await fetch("http://localhost:8080/api/zones/all");
      const data = await response.json();
      setZonees(data);
    };


    const [zoneName, setZoneName] = useState('');
    const [cityId, setCityId] = useState('');
  
    const handleSaveZone = () => {
      if (zoneName.trim() === '' || cityId.trim() === '') {
        alert('Please enter a zone name and select a city.');
        return;
      }
    
      fetch('http://localhost:8080/api/zones/save', {
        method: 'POST',
        body: JSON.stringify({  
          nom: zoneName,
          ville: {
            id: cityId
          }
        }),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      
        fetchZonees();
      })
      .catch(error => console.error(error));
    
      setZoneName('');
      setCityId('');
    };
    
    const deleteZone = async (id) => {
      try {
        await fetch(`http://localhost:8080/api/zones/${id}`, {
          method: 'DELETE',
        });
        fetchZonees();
      } catch (error) {
        
      }
    };
    const handleZoneNameChange = (event) => {
      setZoneName(event.target.value);
    };
  
    const handleCityIdChange = (event) => {
      setCityId(event.target.value);
    };

    
    const [seriees, setSeriees] = useState([]);

    useEffect(() => {
      fetchSeriees();
    }, []);
    
    const fetchSeriees = async () => {
      const response = await fetch("http://localhost:8080/api/serie/all");
      const data = await response.json();
      setSeriees(data);
    };

    
    const [specialitees, setSpecialitees] = useState([]);

    const fetchSpecialitees = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/sepecialite/all');
        const data = await response.json();
        setSpecialitees(data);
      } catch (error) {
      
      }
    };
    
    const deleteSpecialitee = async (id) => {
      try {
        await fetch(`http://localhost:8080/api/sepecialite/${id}`, {
          method: 'DELETE',
        });
        fetchSpecialitees();
      } catch (error) {
      
      }
    };
    
    useEffect(() => {
      fetchSpecialitees();
    }, []);
    
    const [specialiteeName, setSpecialiteeName] = useState('');
    
    const handleSpecialiteeNameChange = (event) => {
      setSpecialiteeName(event.target.value);
    };
    
    const handlespecialiteSaveClick = async () => {
      if (specialiteeName.trim() === '' ) {
        alert('Please enter a specialitee name ');
        return;
      }
    
      try {
        const response = await fetch('http://localhost:8080/api/sepecialite/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nom: specialiteeName }),
        });
        fetchSpecialitees();
        setSpecialiteeName('');
      } catch (error) {
       
      }
    };
    
    
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email2, setEmail2] = useState('');
    const [password2, setPassword2] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const handleSignUp = async () => {
      if (!nom || !prenom || !telephone || !email2 || !password2) {
        alert('Please fill in all required fields.');
        return;
      }
  
      if (password2 !== confirmPassword) {
        alert('Password and Confirm Password do not match.');
        return;
      }
  
      try {
        const response = await axios.post('http://localhost:8080/api/users/save', {
          nom:nom,
          prenom:prenom,
          email: email2,
          telephone : telephone,
          password: password2,
         
         
        });
  
        setNom('');
        setPrenom('');
        setTelephone('');
        setEmail2('');
        setPassword2('');
        setConfirmPassword('');
        alert('Registred')

        setShowFirstDiv(false);
        setShowSecondDiv(false);
        setShowThirdDiv(true);
        setShowFourthDiv(false);
        

      } catch (error) {
        console.error(error);
      }
    };
    
    const [imageName, setImageName] = useState('');

    const handleFileInputChange = (event) => {
      const file = event.target.files[0];
      const fileType = file.type.split('/')[0];
      if (fileType === 'image') {
        setImageName(file.name);
      } else {
        alert('Please select an image file!');
      }
    };

    const [nomm, setNomm] = useState('');
    const [adresse, setAdresse] = useState('');
    const [description, setDescription] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [hourOpened, setHourOpened] = useState('');
    const [hourClosed, setHourClosed] = useState('');
    const [serieId, setSerieId] = useState('');
    const [zoneId, setZoneId] = useState('');
 

    
    const handleNommChange = (event) => {
      setNomm(event.target.value);
    };
  
    const handleAdresseChange = (event) => {
      setAdresse(event.target.value);
    };
  
    const handleDescriptionChange = (event) => {
      setDescription(event.target.value);
    };
  
    const handleLatitudeChange = (event) => {
      setLatitude(event.target.value);
    };
  
    const handleLongitudeChange = (event) => {
      setLongitude(event.target.value);
    };
  
    const handleHourOpenedChange = (event) => {
      setHourOpened(event.target.value);
    };
  
    const handleHourClosedChange = (event) => {
      setHourClosed(event.target.value);
    };
  
    const handleSerieIdChange = (event) => {
      setSerieId(event.target.value);
    };
  
    const handleZoneIdChange = (event) => {
      setZoneId(event.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!nomm || !adresse || !description || !latitude || !longitude || !hourOpened || !hourClosed || !serieId || !zoneId || !imageName) {
        alert('Please fill in all fields');
        return;
      }
    
      // Send a POST request to add the restaurant
      axios.post('http://localhost:8080/api/restaurant/save', {
        nom: nomm,
        adresse: adresse,
        description: description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        hourOpened: hourOpened,
        hourClosed: hourClosed,
        serie: {
          id: parseInt(serieId)
        },
        zone: {
          id: parseInt(zoneId),
          ville: {}
        }
      })
      .then((response) => {
        alert('Restaurant added successfully!');
       
      
        // Send a GET request to fetch the newly added restaurant and save its ID
        axios.get(`http://localhost:8080/api/restaurant/${nomm}/${adresse}/${description}`)
          .then((response) => {
            
         
         
            axios.post(`http://localhost:8080/api/photo/save/${imageName}/${response.data.id}`)
            .then((response) => {
             
              alert('Photo saved successfully');
              setNomm('');setAdresse('');setDescription('');setLatitude('');setLongitude('');setHourOpened('');setHourClosed('');setSerieId('');setZoneId('');
            })
            .catch((error) => {
              console.log(error);
              alert('Error saving photo');
              setNomm('');setAdresse('');setDescription('');setLatitude('');setLongitude('');setHourOpened('');setHourClosed('');setSerieId('');setZoneId('');
            });
            axios.put(`http://localhost:8080/api/users/addrestau/${user.id}/${response.data.id}`)
            .then((response) => {
              checkowner(user.id);
              checkowner2(user.id);
             
            })
            .catch((error) => {
              console.log(error); 
         
            });



          })
          .catch((error) => {
            console.log(error);
            alert('Error fetching restaurant');
            setNomm('');setAdresse('');setDescription('');setLatitude('');setLongitude('');setHourOpened('');setHourClosed('');setSerieId('');setZoneId('');
          });
      })
      
      .catch((error) => {
        console.log(error);
        alert('Error adding restaurant');
        setNomm('');
        setAdresse('');
        setDescription('');
        setLatitude('');
        setLongitude('');
        setHourOpened('');
        setHourClosed('');
        setSerieId('');
        setZoneId('');
      });
    };
    const [addrestaurant, setaddrestaurant] = useState(false);
    const [hasrestaurant, sethasrestaurant] = useState(false);

    function checkowner(id) {
      fetch(`http://localhost:8080/api/users/findrestau/${id}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Request failed');
          }
        })
        .then((data) => {
          if (data == 1) {
            setaddrestaurant(false);
            sethasrestaurant(true);
            checkowner2(id);
          }  if (data == 0) {
            setaddrestaurant(true);
            sethasrestaurant(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    function checkowner2(id) {
      fetch(`http://localhost:8080/api/users/findrestauu/${id}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Request failed');
          }
        })
        .then((data) => {
         setrestaurant2(data);

         
        })
        .catch((error) => {
          console.error(error);
        });
    }
    
    const [restaurant2, setrestaurant2] = useState(null);
    function deleterestaurant(){


    }

  
      return (
        <div id='main' style={{ overflow: "hidden" }}>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
          <title style={{color:'#28242c'}}>Finder</title>
          
          
        

            <div style={{ display: showFirstDiv ? 'block' : 'none' }}>
            <nav className="navbar navbar-dark navbar-expand-md " id="mainNav" style={{backgroundColor: '#19f5aa'}}>
            <div className="container"><a className="navbar-brand d-flex align-items-center" href="/" style={{color:'#28242c'}} ><span>Finder</span></a><button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
              <div className="collapse navbar-collapse" id="navcol-1">
              <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#28242c',color:'#20f4ac',border:'none',marginRight:'10px'}} onClick={handleShowFourthDiv} >Register</a>
                <ul className="navbar-nav ml-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#28242c',color:'#20f4ac',border:'none'}} onClick={handleShowThirdDiv}>Login</a>

              </div>
            </div>
          </nav>
            <div id='Select' className="container bg-dark py-5"  >
              <div className="row">
                <div className="col-md-8 col-xl-6 text-center mx-auto">
                  <p className="fw-bold text-success mb-2">Find Restaurant</p>
                  <h3 className="fw-bold">Select The Zone&nbsp;</h3>
                </div>
              </div>
              <div className="py-5 p-lg-5">
                <div className="row row-cols-1 row-cols-md-2 mx-auto" style={{maxWidth: '900px'}}>
                  <div className="col-xxl-12 mb-5">
                    <div className="card shadow-sm">
                      <div className="card-body px-4 py-5 px-md-5" style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
                        <h5 className="fw-bold card-title" style={{display: 'inline-block', margin: '0 10px', padding: 0}}>
                          City :
                          </h5>
                          <select value={selectedCity} style={{display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}} id="city-select"  onChange={handleCityChange} >
                                        <option value=""  >Select a city</option>
                                            {cities.map(city => (
                                        <option key={city.id} value={city.nom}>
                                            {city.nom}
                                        </option>
                                                          ))}
                          
                          </select>
                          
                          {selectedCity && (
                            <div>
                        <h5 className="fw-bold card-title" style={{display: 'inline-block', margin: '0 10px', padding: 0}}>
                          Zone :</h5>
                          <select value={selectedZone} style={{display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}} id="zone-select" onChange={handleSelectChange}>
                                        <option value="none">Select a zone</option>
                                            {zones.map(zone => (
                                        <option key={zone.id} value={zone.nom}>
                                            {zone.nom}
                                        </option>
                                                            ))}

                          </select>
                          </div>
                          )}
                      </div>
                    </div>
                  </div>
                  <div  className="col-xxl-12" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'} }>
                   
                    
                  {!isButtonHidden && <button className="btn btn-primary shadow" type="button" style={{marginTop: 'auto', marginBottom: 'auto',backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleShowSecondDiv} >
                    Show List
                    </button>}
                    </div>
                </div>
              </div>
            </div>
           </div>

           <div  style={{ display: showSecondDiv ? 'block' : 'none' }}>
           <nav className="navbar navbar-dark navbar-expand-md " id="mainNav" style={{backgroundColor: '#19f5aa'}}>
            <div className="container"><a className="navbar-brand d-flex align-items-center" href="/" style={{color:'#28242c'}} ><span>Finder</span></a><button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
              <div className="collapse navbar-collapse" id="navcol-1">
              <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#28242c',color:'#20f4ac',border:'none',marginRight:'10px'}} onClick={handleShowFourthDiv} >Register</a>
                <ul className="navbar-nav ml-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#28242c',color:'#20f4ac',border:'none'}} onClick={handleShowThirdDiv}>Login</a>              </div>
            </div>
          </nav>
          <div id='List' className="container bg-dark py-5">
            <div className="row">
              
              <div className="col-md-8 col-xl-6 text-center mx-auto">
                <p className="fw-bold text-success mb-2">List Of Restaurant</p>
                <h3 className="fw-bold">Filter the result&nbsp;</h3>
              </div>
            </div>
            <div className="py-5 p-lg-5">
              <div className="py-5 p-lg-5">
                <div className="row row-cols-1 row-cols-md-2 mx-auto" style={{maxWidth: '900px'}}>
                  <div className="col-xxl-12 mb-5">
                    <div className="card shadow-sm">
                      <div className="card-body px-4 py-5 px-md-5" style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
                        <h5 className="fw-bold card-title" style={{display: 'inline-block', margin: '0 10px', padding: 0}}> 
                        Speciality:</h5>
                        <select style={{display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}}  value={selectedSpeciality}onChange={handleSpecialityChange}>
                        <option value="none">Select a speciality</option>
                             {specialites.map(specialite => (
                             <option key={specialite.id} value={specialite.nom}>
                             {specialite.nom}
                             </option>
                             ))}
                        
                        </select>

                        <h5 className="fw-bold card-title" style={{display: 'inline-block', margin: '0 10px', padding: 0}}>
                          Serie:</h5>
                          <select style={{display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}}  value={selectedSerie}onChange={handleSerieChange}>

                          <option value="none">Select a serie</option>
                          
                              {series.map(serie => (
                              <option key={serie.id} value={serie.nom}>
                              {serie.nom}
                              </option>
                              ))}
                          </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-12" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                </div>
                </div>
              </div>
              <div className="container">
            <div className="row product-list dev"> 
             {restaurants.map((restaurant, index) => (
            <div className="col-sm-6 col-md-4 product-item animation-element slide-top-left" key={index}>
            <div className="product-container" >
              <div className="row">
                <div className="col-md-12"><a className="product-image" href="#"><img src={restaurant.photos[0].url} /></a></div>
              </div>
              <div class="row">
                        <div class="col-8">
                            <h2><a href="#">{restaurant.nom}</a></h2>
                           
                            
                        </div>
 
              </div>
              <div className="row">
                <div className="col-12">
                  <p className="product-description">{restaurant.adresse}</p>
                <p className="product-description">{restaurant.description}</p>
                <p className="product-description" style={{fontWeight: 'bold'}}>{restaurant.hourOpened} | {restaurant.hourClosed} </p>
                
                  
                  <div className="row">
                    <div className="col-6"><button className="btn btn-light" type="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}}  onClick={() => send(restaurant.latitude, restaurant.longitude,restaurant.nom)}  >Locate</button></div>
                    <div className="col-6">
                    </div>

                  </div>
                </div>
              </div>  
             
            </div>  
         
          </div>
           ))}
           
           
        </div>
      </div>
            </div>
          </div>
          </div>

          
      <div id='adminpanel'style={{ display: showThirdDiv ? 'block' : 'none' }}>
      {loggedIn ? (
      <div id='afterlogin'>
        <div id='admin' style={{ display: showAdmin ? 'block' : 'none' }}>
                <div id='Mcity'style={{ display: showMcity ? 'block' : 'none' }}>
              <nav className="navbar navbar-dark navbar-expand-md " id="mainNav" style={{backgroundColor: '#19f5aa'}}>
               <div className="container"><a className="navbar-brand d-flex align-items-center"  style={{color:'#28242c'}} ><span></span></a><button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
                <div className="collapse navbar-collapse" id="navcol-1">
                
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#28242c',color:'#20f4ac',border:'none'}} onClick={handleshowMcity}>City  Management</a>
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleshowMzone}>Zone Management</a>
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleshowMserie}>Serie Management</a>
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleshowMspacialite}>Specialty Management</a>
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleLogout} >Logout</a>
              </div>
               </div>
               </nav>
            <div id='Select' className="container bg-dark py-5"  >
              <div className="row">
                <div className="col-md-8 col-xl-6 text-center mx-auto">
                  <p className="fw-bold text-success mb-2">Admin Panel</p>
                  <h3 className="fw-bold">Welcome <span>{(user.nom)}</span></h3>
                </div>
              </div>
              <div className="py-5 p-lg-5">
                <div className="row row-cols-1 row-cols-md-2 mx-auto" style={{maxWidth: '900px'}}>
                  <div className="col-xxl-12 mb-5">
                    <div className="card shadow-sm">
                      <div className="card-body px-4 py-5 px-md-5" style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
                        <h5 className="fw-bold card-title" style={{display: 'inline-block', margin: '0 10px', padding: 0 , color:'#20f4ac'}}>
                          City :
                          </h5>
                          <input style={{display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}} value={cityName} onChange={handleCityNameChange}  >
                                     
                          
                          </input>
                          
                         <button style={{ fontWeight: 'bold',display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '50px',backgroundColor: '#20f4ac',color:'#28242c',textAlignLast: "center",height:'40px'}} onClick={handleSaveClick}>Add</button>
                          
                      </div>
                    </div>
                  </div>
              
                </div>

                <div className="row row-cols-1 row-cols-md-2 mx-auto" style={{maxWidth: '900px'}}>
                <table id="example" className="table table-striped table-bordered" cellSpacing={0} width="100%">
      <thead>
        <tr>
          <th style={{ textAlign: "center" }}>Id</th>
          <th style={{ textAlign: "center" }}>City</th>
          <th style={{ textAlign: "center" }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {citiees.map((city) => (
          <tr key={city.id}>
            <td style={{ textAlign: "center" }}>{city.id}</td>
            <td style={{ textAlign: "center" }}>{city.nom}</td>
            <td style={{ textAlign: "center" }}>
              <button type="button" className="btn btn-danger"onClick={() => deleteCity(city.id)}>Delete</button>
              <button type="button" className="btn btn-warning">Update</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
                </div>
              </div>
            </div>
       

                </div>
                <div id='Mzone'style={{ display: showMzone ? 'block' : 'none' }}>
              <nav className="navbar navbar-dark navbar-expand-md " id="mainNav" style={{backgroundColor: '#19f5aa'}}>
               <div className="container"><a className="navbar-brand d-flex align-items-center"  style={{color:'#28242c'}} ><span></span></a><button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
                <div className="collapse navbar-collapse" id="navcol-1">
                
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleshowMcity}>City  Management</a>
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#28242c',color:'#20f4ac',border:'none'}} onClick={handleshowMzone}>Zone Management</a>
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleshowMserie}>Serie Management</a>
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleshowMspacialite}>Specialty Management</a>
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleLogout} >Logout</a>
              </div>
               </div>
               </nav>
            <div id='Select' className="container bg-dark py-5"  >
              <div className="row">
                <div className="col-md-8 col-xl-6 text-center mx-auto">
                  <p className="fw-bold text-success mb-2">Admin Panel</p>
                  <h3 className="fw-bold">Welcome <span>{(user.nom)}</span></h3>
                </div>
              </div>
              <div className="py-5 p-lg-5">
                <div className="row row-cols-1 row-cols-md-2 mx-auto" style={{maxWidth: '900px'}}>
                  <div className="col-xxl-12 mb-5">
                    <div className="card shadow-sm">
                      <div className="card-body px-4 py-5 px-md-5" style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
                        <h5 className="fw-bold card-title" style={{display: 'inline-block', margin: '0 10px', padding: 0 , color:'#20f4ac'}}>
                          Zone :
                          </h5>
                          <input style={{display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}} value={zoneName} onChange={handleZoneNameChange}  >
                                     
                          
                          </input>
                          
                         <select  style={{display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}} value={cityId} onChange={handleCityIdChange} >
                                        <option   >Select a city</option>
                                            {citiees.map(city => (
                                        <option key={city.id} value={city.id}>
                                            {city.nom}
                                        </option>
                                                          ))}
                          
                          </select>
                          <button style={{ fontWeight: 'bold',display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '50px',backgroundColor: '#20f4ac',color:'#28242c',textAlignLast: "center",height:'40px'}} onClick={handleSaveZone}>Add</button>

                      </div>
                    </div>
                  </div>
              
                </div>

                <div className="row row-cols-1 row-cols-md-2 mx-auto" style={{maxWidth: '900px'}}>
                <table id="example" className="table table-striped table-bordered" cellSpacing={0} width="100%">
      <thead>
        <tr>
          <th style={{ textAlign: "center" }}>Id</th>
          <th style={{ textAlign: "center" }}>Zone</th>
          <th style={{ textAlign: "center" }}>City</th>
          <th style={{ textAlign: "center" }}>Action</th>
        </tr>
      </thead>
      <tbody>
      {zonees.map((zone) => (
          <tr key={zone.id}>
            <td style={{ textAlign: "center" }}>{zone.id}</td>       
            <td style={{ textAlign: "center" }}>{zone.nom}</td>
            <td style={{ textAlign: "center" }}>{zone.ville.nom}</td>
            <td style={{ textAlign: "center" }} >
              <button type="button" className="btn btn-danger" onClick={() => deleteZone(zone.id)} >Delete</button>
              <button type="button" className="btn btn-warning">Update</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
                </div>
              </div>
            </div>
       

                </div>
                <div id='Mserie'style={{ display: showMserie ? 'block' : 'none' }}>
              <nav className="navbar navbar-dark navbar-expand-md " id="mainNav" style={{backgroundColor: '#19f5aa'}}>
               <div className="container"><a className="navbar-brand d-flex align-items-center"  style={{color:'#28242c'}} ><span></span></a><button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
                <div className="collapse navbar-collapse" id="navcol-1">
                
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleshowMcity}>City  Management</a>
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleshowMzone}>Zone Management</a>
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#28242c',color:'#20f4ac',border:'none'}} onClick={handleshowMserie}>Serie Management</a>
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleshowMspacialite}>Specialty Management</a>
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleLogout} >Logout</a>
              </div>
               </div>
               </nav>
            <div id='Select' className="container bg-dark py-5"  >
              <div className="row">
                <div className="col-md-8 col-xl-6 text-center mx-auto">
                  <p className="fw-bold text-success mb-2">Admin Panel</p>
                  <h3 className="fw-bold">Welcome <span>{(user.nom)}</span></h3>
                </div>
              </div>
              <div className="py-5 p-lg-5">
                <div className="row row-cols-1 row-cols-md-2 mx-auto" style={{maxWidth: '900px'}}>
                  <div className="col-xxl-12 mb-5">
                    <div className="card shadow-sm">
                      <div className="card-body px-4 py-5 px-md-5" style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
                        <h5 className="fw-bold card-title" style={{display: 'inline-block', margin: '0 10px', padding: 0 , color:'#20f4ac'}}>
                          Serie :
                          </h5>
                          <input style={{display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}} value={cityName} onChange={handleCityNameChange}  >
                                     
                          
                          </input>
                          
                         <button style={{ fontWeight: 'bold',display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '50px',backgroundColor: '#20f4ac',color:'#28242c',textAlignLast: "center",height:'40px'}} onClick={handleSaveClick}>Add</button>
                          
                      </div>
                    </div>
                  </div>
              
                </div>

                <div className="row row-cols-1 row-cols-md-2 mx-auto" style={{maxWidth: '900px'}}>
                <table id="example" className="table table-striped table-bordered" cellSpacing={0} width="100%">
      <thead>
        <tr>
          <th style={{ textAlign: "center" }}>Id</th>
          <th style={{ textAlign: "center" }}>Serie</th>
          <th style={{ textAlign: "center" }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {seriees.map((serie) => (
          <tr key={serie.id}>
            <td style={{ textAlign: "center" }}>{serie.id}</td>
            <td style={{ textAlign: "center" }}>{serie.nom}</td>
            <td style={{ textAlign: "center" }}>
              <button type="button" className="btn btn-danger">Delete</button>
              <button type="button" className="btn btn-warning">Update</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
                </div>
              </div>
            </div>
       

                </div>
                <div id='Mspeciality'style={{ display: showMspacialite ? 'block' : 'none' }}>
              <nav className="navbar navbar-dark navbar-expand-md " id="mainNav" style={{backgroundColor: '#19f5aa'}}>
               <div className="container"><a className="navbar-brand d-flex align-items-center"  style={{color:'#28242c'}} ><span></span></a><button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
                <div className="collapse navbar-collapse" id="navcol-1">
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleshowMcity}>City  Management</a>
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleshowMzone}>Zone Management</a>
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleshowMserie}>Serie Management</a>
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#28242c',color:'#20f4ac',border:'none'}} onClick={handleshowMspacialite}>Specialty Management</a>
                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleLogout} >Logout</a>
              </div>
               </div>
               </nav>
            <div id='Select' className="container bg-dark py-5"  >
              <div className="row">
                <div className="col-md-8 col-xl-6 text-center mx-auto">
                  <p className="fw-bold text-success mb-2">Admin Panel</p>
                  <h3 className="fw-bold">Welcome <span>{(user.nom)}</span></h3>
                </div>
              </div>
              <div className="py-5 p-lg-5">
                <div className="row row-cols-1 row-cols-md-2 mx-auto" style={{maxWidth: '900px'}}>
                  <div className="col-xxl-12 mb-5">
                    <div className="card shadow-sm">
                      <div className="card-body px-4 py-5 px-md-5" style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
                        <h5 className="fw-bold card-title" style={{display: 'inline-block', margin: '0 10px', padding: 0 , color:'#20f4ac'}}>
                          Speciality :
                          </h5>
                          <input style={{display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}} value={specialiteeName} onChange={handleSpecialiteeNameChange}  >
                                     
                          
                          </input>
                          
                         <button style={{ fontWeight: 'bold',display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '50px',backgroundColor: '#20f4ac',color:'#28242c',textAlignLast: "center",height:'40px'}} onClick={handlespecialiteSaveClick}>Add</button>
                          
                      </div>
                    </div>
                  </div>
              
                </div>

                <div className="row row-cols-1 row-cols-md-2 mx-auto" style={{maxWidth: '900px'}}>
                <table id="example" className="table table-striped table-bordered" cellSpacing={0} width="100%">
      <thead>
        <tr>
          <th style={{ textAlign: "center" }}>Id</th>
          <th style={{ textAlign: "center" }}>Speciality</th>
          <th style={{ textAlign: "center" }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {specialitees.map((specialite) => (
          <tr key={specialite.id}>
            <td style={{ textAlign: "center" }}>{specialite.id}</td>
            <td style={{ textAlign: "center" }}>{specialite.nom}</td>
            <td style={{ textAlign: "center" }}>
              <button type="button" className="btn btn-danger" onClick={deleteSpecialitee}>Delete</button>
              <button type="button" className="btn btn-warning">Update</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
                </div>
              </div>
            </div>
       

                </div>
        </div>
        <div id='Owner' style={{ display: showOwner ? 'block' : 'none' }}>
                <div id='addrestaurant'  style={{ display: addrestaurant ? 'block' : 'none' }} >
              <nav className="navbar navbar-dark navbar-expand-md " id="mainNav" style={{backgroundColor: '#19f5aa'}}>
               <div className="container"><a className="navbar-brand d-flex align-items-center"  style={{color:'#28242c'}} ><span></span></a><button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
                <div className="collapse navbar-collapse" id="navcol-1">
                

                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleLogout} >Logout</a>
              </div>
               </div>
               </nav>
            <div id='Select' className="container bg-dark py-5"  >
              <div className="row">
                <div className="col-md-8 col-xl-6 text-center mx-auto">
                  <p className="fw-bold text-success mb-2">You don't have a restaurant add one !</p>
                  <h3 className="fw-bold">Welcome <span>{(user.nom)}</span></h3>
                </div>
              </div>
              <div className="py-5 p-lg-5">
                <div className="row row-cols-1 row-cols-md-2 mx-auto" style={{maxWidth: '900px'}}>
                  <div className="col-xxl-12 mb-5">
                    <div className="card shadow-sm">
                      <div className="card-body px-4 py-5 px-md-5" style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
                      <div style={{display: 'flex', flexDirection: 'column'}}>
                        
                {/* Nom */}
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}} value={nomm} onChange={handleNommChange}>
                    <input style={{margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}} placeholder='Nom' name="nom"></input>
                </div>

                {/* Adresse */}
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}} value={adresse} onChange={handleAdresseChange}>
                  
                  <input style={{margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}} placeholder='Adresse' name="adresse"></input>
                </div>

                {/* Description */}
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}} value={description} onChange={handleDescriptionChange} >

                  <input style={{margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}} placeholder='Description ' name="description"></input>
                </div>

                {/* Latitude */}
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}} value={latitude} onChange={handleLatitudeChange} >
                
                  <input style={{margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}} placeholder='Latitude' name="latitude"></input>
                </div>

              {/* Longitude */}
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}} value={longitude} onChange={handleLongitudeChange}>

                <input style={{margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}} placeholder='Longitude ' name="longitude"></input>
              </div>

              {/* Hour Opened */}
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}} value={hourOpened} onChange={handleHourOpenedChange}>

                <input style={{margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}} placeholder='Hour Opened' name="hourOpened"></input>
              </div>

              {/* Hour Closed */}
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}value={hourClosed} onChange={handleHourClosedChange}>
                
                <input style={{margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}} placeholder='Hour Closed' name="hourClosed"></input>
              </div>

              {/* Serie */}
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
              <select style={{display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}}  value={serieId} onChange={handleSerieIdChange}>

              <option value="none">Select a serie</option>

                  {series.map(serie => (
                  <option key={serie.id} value={serie.id}>
                  {serie.nom}
                  </option>
                  ))}
              </select>
              </div>

              <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
              <select value={selectedCity} style={{display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}} id="city-select"  onChange={handleCityChange} >
                                                      <option value=""  >Select a city</option>
                                                          {cities.map(city => (
                                                      <option key={city.id} value={city.nom}>
                                                          {city.nom}
                                                      </option>
                                                                        ))}
                                        
                                        </select>
                                        </div>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
              <select style={{display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}} id="zone-select" value={zoneId} onChange={handleZoneIdChange}>
                                                      <option value="none">Select a zone</option>
                                                          {zones.map(zone => (
                                                      <option key={zone.id} value={zone.id}>
                                                          {zone.nom}
                                                      </option>
                                                                          ))}

                                        </select>
                                        </div>
              {/* Image */}

              <div className="file-input-container" >
                    <input type="file" className="file-input" onChange={handleFileInputChange}  />
                  {console.log({imageName})} 
                    <label className="file-input-label" style={{display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#28242c',color:'white',textAlignLast: "center"}}  > Choose image</label>
                  </div>
                  <br></br>
                  <button className="fw-bold"  style={{display: 'inline-block', margin: '0 10px', padding: '5px', borderRadius: '10px', width: '200px',backgroundColor: '#20f4ac',color:'black',textAlignLast: "center"}} onClick={handleSubmit} >Add</button>

              </div>


                                    </div>
                                  
                                  </div>
                                </div>
                            
                              </div>

                            
                            </div>
                          </div>
                    

                              </div>
                <div id='hasrestaurant'  style={{ display: hasrestaurant ? 'block' : 'none' }}  >
                <nav className="navbar navbar-dark navbar-expand-md " id="mainNav" style={{backgroundColor: '#19f5aa'}}>
               <div className="container"><a className="navbar-brand d-flex align-items-center"  style={{color:'#28242c'}} ><span></span></a><button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
                <div className="collapse navbar-collapse" id="navcol-1">
                

                <ul className="navbar-nav mx-auto" /><a className="btn btn-primary shadow" role="button" style={{backgroundColor: '#20f4ac',color:'#28242c',border:'none'}} onClick={handleLogout} >Logout</a>
              </div>
               </div>
               </nav>
            <div id='Select' className="container bg-dark py-5"  >
              <div className="row">
                <div className="col-md-8 col-xl-6 text-center mx-auto">
                  <p className="fw-bold text-success mb-2">Update your restaurant</p>
                  <h3 className="fw-bold">Welcome <span>{(user.nom)}</span></h3>
                </div>
              </div>
              <div className="py-5 p-lg-5">
     

                <div className="row row-cols-1 row-cols-md-2 mx-auto" style={{maxWidth: '900px'}}>
                <table id="example" className="table table-striped table-bordered" cellSpacing={0} width="100%">
      <thead>
        <tr>
          <th style={{ textAlign: "center" }}>City</th>
          <th style={{ textAlign: "center" }}>Zone</th>
          <th style={{ textAlign: "center" }}>Adresse</th>
          <th style={{ textAlign: "center" }}>Hour opened</th>
          <th style={{ textAlign: "center" }}>Hour closed</th>
          <th style={{ textAlign: "center" }}>Latitude</th>
          <th style={{ textAlign: "center" }}>Longitude</th>
          <th style={{ textAlign: "center" }}>Zone</th>
          <th style={{ textAlign: "center" }}>City</th>
          <th style={{ textAlign: "center" }}>Serie</th>
          <th style={{ textAlign: "center" }}>Action</th>
        
        </tr>
      </thead>
      {restaurant2 && (
  <tbody>
    <tr key={restaurant2.id}>   
    <td style={{ textAlign: "center" }}>{restaurant2.nom}</td>
      <td style={{ textAlign: "center" }}>{restaurant2.adresse}</td>
      <td style={{ textAlign: "center" }}>{restaurant2.description}</td>
      <td style={{ textAlign: "center" }}>{restaurant2.latitude}</td>
      <td style={{ textAlign: "center" }}>{restaurant2.longitude}</td>
      <td style={{ textAlign: "center" }}>{restaurant2.hourOpened}</td>
      <td style={{ textAlign: "center" }}>{restaurant2.hourClosed}</td>
      <td style={{ textAlign: "center" }}>{restaurant2.zone.nom}</td>
      <td style={{ textAlign: "center" }}>{restaurant2.zone.ville.nom}</td>
      <td style={{ textAlign: "center" }}>{restaurant2.serie.nom}</td>

      <td style={{ textAlign: "center" }}>
        <button type="button" className="btn btn-danger" onClick={() => deleterestaurant(restaurant2.id)}>Delete</button>
        <button type="button" className="btn btn-warning">Update</button>
      </td>
    </tr>
  </tbody>
)}

    </table>
                </div>
              </div>
            </div>
                                 </div>                           
                      </div>       
                    </div>
          ) : (
        <div id='login'>
      <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
          <title style={{color:'#28242c'}}>Finder</title>
          <nav className="navbar navbar-dark navbar-expand-md " id="mainNav" style={{backgroundColor: '#19f5aa'}}>
            <div className="container"><a className="navbar-brand d-flex align-items-center" href="/" style={{color:'#28242c'}} ><span>Finder</span></a><button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
              <div className="collapse navbar-collapse" id="navcol-1">
                
              </div>
            </div>
          </nav>
        <section className="py-5">
          <div className="container py-5">
            <div className="row mb-4 mb-lg-5">
              <div className="col-md-8 col-xl-6 text-center mx-auto">
                <p className="fw-bold text-success mb-2">Login</p>
                <h2 className="fw-bold">Welcome Back</h2>
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              <div className="col-md-6 col-xl-4">
                <div className="card">
                  <div className="card-body text-center d-flex flex-column align-items-center">
                    <div className="bs-icon-xl bs-icon-circle bs-icon-primary shadow bs-icon my-4" style={{backgroundColor: '#19f5aa', color: '#28242c'}}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-person">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                      </svg></div>
                    
                      <div className="mb-3"><input className="form-control" type="email" name="email" placeholder="Email"   value={email}    onChange={(event) => setEmail(event.target.value)} /></div>
                      <div className="mb-3"><input className="form-control" type="password" name="password" placeholder="Password"  value={password} onChange={(event) => setPassword(event.target.value)} /></div>
                      <div className="mb-3"><button className="btn btn-primary shadow d-block w-100"  style={{backgroundColor: '#19f5aa', color: '#28242c'}}onClick={handleLogin}>Log in</button></div>
                      <p class="text-muted">You don't account create one ? <a onClick={handleShowFourthDiv}   onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={underlineStyle}>Sign up</a></p>
                      
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
     )}
          </div>
           
          <div id='SignUp' style={{ display: showFourthDiv ? 'block' : 'none' }} >
      <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
          <title style={{color:'#28242c'}}>Finder</title>
          <nav className="navbar navbar-dark navbar-expand-md " id="mainNav" style={{backgroundColor: '#19f5aa'}}>
            <div className="container"><a className="navbar-brand d-flex align-items-center" href="/" style={{color:'#28242c'}} ><span>Finder</span></a><button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
              <div className="collapse navbar-collapse" id="navcol-1">
                
              </div>
            </div>
          </nav>
        <section className="py-5">
          <div className="container py-5">
            <div className="row mb-4 mb-lg-5">
              <div className="col-md-8 col-xl-6 text-center mx-auto">
                <p className="fw-bold text-success mb-2">Sign Up</p>
                <h2 className="fw-bold">Welcome </h2>
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              <div className="col-md-6 col-xl-4">
                <div className="card">
                  <div className="card-body text-center d-flex flex-column align-items-center">
                    <div className="bs-icon-xl bs-icon-circle bs-icon-primary shadow bs-icon my-4" style={{backgroundColor: '#19f5aa', color: '#28242c'}}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-person">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                      </svg></div>
                    
                      
                      <div className="mb-3"><input className="form-control" type="Text" name="nom" placeholder="Nom" value={nom} onChange={(event) => setNom(event.target.value)} required /></div>
                      <div className="mb-3"><input className="form-control" type="Text" name="Prenom" placeholder="Prenom" value={prenom} onChange={(event) => setPrenom(event.target.value)}required  /></div>
                      <div className="mb-3"><input className="form-control" type="email" name="email" placeholder="Email"   value={email2} onChange={(event) => setEmail2(event.target.value)} required /></div>
                      <div className="mb-3"><input className="form-control" type="Text" name="telephone" placeholder="Telephone"  value={telephone} onChange={(event) => setTelephone(event.target.value)} required /></div>
                      <div className="mb-3"><input className="form-control" type="password" name="password" placeholder="Password" value={password2} onChange={(event) => setPassword2(event.target.value)} required   /></div>
                      <div className="mb-3"><input className="form-control" type="password" name="password" placeholder=" Confirm Password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required   /></div>
                      
                      <div className="mb-3"><button className="btn btn-primary shadow d-block w-100"  style={{backgroundColor: '#19f5aa', color: '#28242c'}} onClick={handleSignUp}>Register</button></div>
                      <p class="text-muted">Already have an account ? <a onClick={handleShowThirdDiv}   onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={underlineStyle}>Log in</a></p>
                      
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>   


          </div>
       
     
          
     
      
      );
    }


    



export default App;
