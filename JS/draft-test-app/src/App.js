import React, { useState } from 'react';
import {ImTwitter} from "react-icons/im";
import './App.css';
import {Box, Button, Tooltip, extendTheme, ChakraProvider} from "@chakra-ui/react";

const customTheme = extendTheme({
  components: {
    Tooltip: {
      baseStyle: {
        fontSize: "0.1em",
        fontWeight: "bold",
        backgroundColor: "blue.400",
        padding: "2px",
        borderRadius: "2px",
        boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
      },
    },
  },
})

const Xtheme = extendTheme({
  components:{
    Tooltip: {
      baseStyle: {
        backgroundColor: "black",
      }
    }
  }
})

function handleClick(){
  console.log("Apple pie!");
}

function App() {
 return (
    <div>
      <header className="App">
        TextTest
        <Box display="inline-block">
          <ChakraProvider theme={customTheme}>
            <Tooltip label = "test" placement="left" fontSize="md">
              <div>
                <ImTwitter
                  style={{marginLeft : "10px"}}
                  onClick={ handleClick }
                />
              </div>
            </Tooltip>
          </ChakraProvider>
        </Box>
        <Box p="4px" display="flex" marginLeft="100px">
          <ChakraProvider theme={customTheme}>
            <Tooltip label="copy" placement="left">
              <div>
                <ImTwitter size={24} />
              </div>
            </Tooltip>
          </ChakraProvider>
          Apple Pie!
        </Box>
      </header>

      <body>
        <Box display="inline-block" style={{ margin: "10rem" }}>
          <ChakraProvider theme={Xtheme} >
            <Tooltip label="X" fontSize="md" placement="left">
              <Button colorScheme="blue"><ImTwitter marginLeft="5px"/>Twitter</Button>
            </Tooltip>
          </ChakraProvider>
        </Box>
      </body>
    </div>
 );
}

export default App;