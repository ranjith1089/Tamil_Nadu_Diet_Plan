import 'package:flutter/material.dart';

void main() {
  runApp(const TnFitnessApp());
}

class TnFitnessApp extends StatelessWidget {
  const TnFitnessApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TN Fitness',
      debugShowCheckedModeBanner: false,
      home: const Scaffold(
        body: Center(
          child: Text('TN Fitness Mobile Scaffold'),
        ),
      ),
    );
  }
}
