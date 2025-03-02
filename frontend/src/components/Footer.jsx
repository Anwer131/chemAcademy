import React from 'react'
import { Box, Container, Grid, Typography, Link, Divider, IconButton } from '@mui/material'
import {Instagram, X, LinkedIn, Email } from '@mui/icons-material'
import logo from '../assets/logo.png'

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'text.primary',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderTop: '1px solid #cccccc',
        paddingTop: 2,
		marginTop: 5,
      }}
    >
      <Container>
        <Grid container spacing={4}>
          <Grid item md={3}>
            <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>About Website</Typography>
            <Typography variant='body1' color='primary.main' align='justify'>chemAcademy is a dedicated platform designed to support chemical engineering students by providing a comprehensive collection of learning materials, tools, and resources to excel in their academic journey.</Typography>
            <Divider/>
            <Typography sx={{mt:2}} color='secondary.main'>If you want to contribute content, tools, or ideas to this platform, please connect: </Typography>
            <IconButton
            
              href="mailto:anwer.webdev@gmail.com"  // Replace with your email
              color="primary.main"
              aria-label="Send Email"
            >
              <Typography variant="body1">Send Email</Typography>
              <Email />
            </IconButton>
          </Grid>

          <Grid item md={2}>
            <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>Portal Links</Typography>
            <ul style={{listStyleType:'none', padding: 0}}>
              <li><Link href="https://home.iitd.ac.in/" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>IIT Delhi Website</Link></li>
              <li><Link href="http://moodle.iitd.ac.in/" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>Moodle</Link></li>
              <li><Link href="https://webmail.iitd.ac.in/roundcube/" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>Webmail</Link></li>
              <li><Link href="http://teams.microsoft.com/" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>Microsoft Teams</Link></li>
              <li><Link href="https://eacademics.iitd.ac.in/sportal/login" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>E-Academics</Link></li>
              <li><Link href="https://ecampus.iitd.ac.in/scorner/login" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>Students E-Corner</Link></li>
              <li><Link href="https://ngu.iitd.ac.in/index" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>NGU Portal</Link></li>
              <li><Link href="http://nss.iitd.ac.in/#!/check_hours" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>NSS Hours</Link></li>
              <li><Link href="https://bsw.iitd.ac.in/mental_health.php" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>Your Dost and SCS</Link></li>
              <li><Link href="https://ocs.iitd.ac.in/portal/login?role=student" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>OCS Student Login</Link></li>
            </ul>
          </Grid>

          <Grid item md={2}>
            <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>Academic Links</Typography>
            <ul style={{listStyleType:'none', padding: 0}}>
              <li><Link href="https://timetable.iitd.ac.in/public/storage/uploads/schedule/Semester%20Schedule%20for%20Semester%20I,%202022-23%20_1655978297.pdf" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>Semester Schedule</Link></li>
              <li><Link href="https://home.iitd.ac.in/uploads/COURSES-OF-STUDY-2021-22.pdf" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>Course of Study</Link></li>
              <li><Link href="https://ocs.iitd.ac.in" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>IITD OCS Portal</Link></li>
              <li><Link href="https://www.reclab.in/" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>Prof. Ali Haider's Website</Link></li>
            </ul>
          </Grid>

          <Grid item md={2}>
            <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>Resources</Typography>
            <ul style={{listStyleType:'none', padding: 0}}>
              <li><Link href="https://bsw.iitd.ac.in/question_papers.php" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>BSW PYQs</Link></li>
              <li><Link href="https://auth.devclub.in/user/login/?serviceURL=https://study.devclub.in/books/" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>Citadel PYQs</Link></li>
              <li><Link href="https://docs.google.com/document/d/1-frvuORBuCQyOQ50Po3lLG71kN3kj4HGoYzITXabPpc/edit?usp=drivesdk" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>Recommended books</Link></li>
              <li><Link href="https://drive.google.com/drive/folders/1SqjgHxREHuDbWxF8u_XJSWwNU_YnAoqh?usp=sharing" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>Hemant's Google Drive</Link></li>
              <li><Link href="https://drive.google.com/drive/folders/1vp9Li0H8KsJalXtxCZr86a4oSLZjnfFo" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>Franklin's Google Drive</Link></li>
              <li><Link href="https://www.youtube.com/channel/UCI0VVtXkSNYGMqRFhbjOtMQ/videos" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>CLL252 Lecture Videos</Link></li>
              <li><Link href="https://csciitd-my.sharepoint.com/:f:/g/personal/ch7191069_iitd_ac_in/EoYwy4uNvqNInn7MecWNzSoBUDK6hDogYVdDL3R4VnFBNg" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>Ayush's One Drive</Link></li>
              <li><Link href="http://bit.ly/chem2021acad" target="_blank" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>Acad. session FAQ</Link></li>
            </ul>
          </Grid>

          <Grid item md={2}>
            <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>WA Communities</Typography>
            <ul style={{listStyleType:'none', padding: 0}}>
              <li><Link href="https://chat.whatsapp.com/KkKw168OAVoGZTqQ93kgUD" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>Chemical UG</Link></li>
              <li><Link href="https://chat.whatsapp.com/EEqO2fWFcQy7dfBtarrekk" sx={{ textDecoration: 'none', fontSize: '0.8rem', '&:hover': { cursor: 'pointer', color: 'primary.main' } }}>Chemical DEs</Link></li>
            </ul>
          </Grid>
        </Grid>
		<Grid container justifyContent="center">
    <Box display="flex" justifyContent="center" alignItems="center" width="100%">
      <img 
        src={logo} 
        alt="Logo" 
        style={{ height: '50px', width: 'auto' }} 
      />
    </Box>
		<ul style={{ display: 'flex', alignItems: 'center', listStyle: 'none', padding: 0, gap: '10px' }}>
			<li>
				<Link 
				href="https://www.linkedin.com/in/munazzil-anwer" 
				target="_blank" 
				sx={{
					transition: 'all 0.3s ease',
					'&:hover': { 
					cursor: 'pointer', 
					color: 'white',  // Change to white on hover
					transform: 'scale(1.1)',  // Slight zoom effect
					}
				}}
				>
				<LinkedIn />
				</Link>
			</li><li>
				<Link 
				href="https://www.twitter.com/munazzil131/" 
				target="_blank" 
				sx={{
					transition: 'all 0.3s ease',
					'&:hover': { 
					cursor: 'pointer', 
					color: 'white',  // Change to white on hover
					transform: 'scale(1.1)',  // Slight zoom effect
					}
				}}
				>
				<X />
				</Link>
			</li>
			
			<li>
				<Link 
				href="https://www.instagram.com/munazzil_13" 
				target="_blank" 
				sx={{
					transition: 'all 0.3s ease',
					'&:hover': { 
					cursor: 'pointer', 
					color: 'white',  // Change to white on hover
					transform: 'scale(1.1)',  // Slight zoom effect
					}
				}}
				>
				<Instagram />
				</Link>
			</li>
			</ul>

        </Grid>
      </Container>
    </Box>
  )
}

export default Footer
