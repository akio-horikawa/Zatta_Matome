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
        backgroundColor: "blue.200",
        padding: "2px",
        borderRadius: "2px",
        boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
      },
    },
  },
})

function App() {
 return (
    <div>
      <header className="App">
        TextTest
        <Box display="inline-block">
          <ChakraProvider theme={customTheme}>
            <Tooltip label = "t" fontSize="md" placement="left">
              <a>
                <ImTwitter
                  style={{marginLeft : "10px"}}
                />
              </a>
            </Tooltip>
          </ChakraProvider>
        </Box>
      </header>
      <body>
        <Box display="inline-block" style={{ margin: "10rem" }}>
          <ChakraProvider theme={customTheme}>
            <Tooltip label="copy" fontSize="md" placement="left">
              <Button colorScheme="teal">ホバーしてみろよ、できるものなら......</Button>
            </Tooltip>
          </ChakraProvider>
        </Box>
      </body>
    </div>
 );
}

export default App;