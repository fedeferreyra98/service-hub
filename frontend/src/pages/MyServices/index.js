import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid, Pagination } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import NotificationGreen from '../../components/ui/NotificationGreen';
import NotificationRed from '../../components/ui/NotificationRed';
import ServiceCardEditable from './ServiceCardEditable';
import {
  apiGetServicesByUser,
  apiDeleteService,
  apiCreateService,
} from '../../api/apiService';
import ServiceForm from '../../components/form/ServiceForm';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: '#DDEBF8',
  },
  mainContent: {
    padding: theme.spacing(5),
    textAlign: 'left',
    backgroundColor: '#DDEBF8',
  },
  button: {
    margin: theme.spacing(1),
  },
  card: {
    margin: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: '100%',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  footer: {
    marginTop: theme.spacing(5),
    padding: theme.spacing(3),
    backgroundColor: '#f5f5f5',
  },
}));

function MyServices() {
  const classes = useStyles();
  const [services, setServices] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationRedOpen, setNotificationRedOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationRedMessage, setNotificationRedMessage] = useState('');

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 9;
  const totalPages = Math.ceil(services.length / servicesPerPage);

  const currentServices = services.slice(
    (currentPage - 1) * servicesPerPage,
    currentPage * servicesPerPage
  );

  // Fetch services from API
  useEffect(() => {
    const fetchMyServices = async () => {
      try {
        const myServicesData = await apiGetServicesByUser();
        setServices(myServicesData);
      } catch (error) {
        console.log('Error while fetching my services:', error);
      }
    };
    fetchMyServices();
  }, [notificationOpen]);

  // Delete a service
  const deleteService = async (serviceId) => {
    try {
      await apiDeleteService(serviceId);
      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== serviceId)
      );
      setNotificationMessage('Servicio eliminado correctamente');
      setNotificationOpen(true);
    } catch (error) {
      setNotificationMessage('Error al eliminar el servicio');
    }
  };

  // Create a service
  const handleCreateService = async (values, actions) => {
    try {
      await apiCreateService(values);
      setNotificationMessage('Servicio creado correctamente');
      setNotificationOpen(true);
      setDialogOpen(false);
      actions.resetForm();
    } catch (error) {
      console.log(error);
      setNotificationRedMessage('Error al crear el servicio');
      setNotificationRedOpen(true);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div>
      <Container className={classes.mainContent}>
        <Container className={classes.root}>
          <Typography variant="h4" gutterBottom>
            Mis Servicios
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            Nuevo Servicio
          </Button>
          <Grid container spacing={2}>
            {currentServices.length === 0 ? (
              <Grid
                item
                m={2}
                xs={12}
                // eslint-disable-next-line no-underscore-dangle
                style={{ display: 'flex' }}
              >
                <Typography variant="h5">
                  Aun no has cargado ningún servicio
                </Typography>
              </Grid>
            ) : (
              currentServices.map((service) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  // eslint-disable-next-line no-underscore-dangle
                  key={service._id}
                  style={{ display: 'flex' }}
                >
                  <ServiceCardEditable
                    service={service}
                    setNotificationMessage={setNotificationMessage}
                    setNotificationOpen={setNotificationOpen}
                    // eslint-disable-next-line no-underscore-dangle
                    onDelete={() => deleteService(service._id)}
                    classes={classes}
                  />
                </Grid>
              ))
            )}
          </Grid>
          <div className={classes.paginationContainer}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
            />
          </div>

          <footer className={classes.footer}>
            <Typography variant="h6" align="center" gutterBottom>
              Brainify
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              color="textSecondary"
            >
              Contacto: info@brainify.com
            </Typography>
          </footer>

          <ServiceForm
            isOpen={dialogOpen}
            onClose={() => {
              setDialogOpen(false);
            }}
            handleSubmit={(values, actions) => {
              handleCreateService(values, actions);
            }}
          />

          <NotificationGreen
            open={notificationOpen}
            message={notificationMessage}
            onClose={() => {
              setNotificationOpen(false);
            }}
          />
          <NotificationRed
            open={notificationRedOpen}
            message={notificationRedMessage}
            onClose={() => setNotificationRedOpen(false)}
          />
        </Container>
      </Container>
    </div>
  );
}
export default MyServices;
