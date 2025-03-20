const stepComponents = [
    <Description activeStep={activeStep} handleStepChange={handleStepChange} />,
    <Categories activeStep={activeStep} handleStepChange={handleStepChange} />,
    <Photos activeStep={activeStep} handleStepChange={handleStepChange} />,
    <Delivery activeStep={activeStep} handleStepChange={handleStepChange} />,
  ];
  

  {stepComponents[activeStep]}